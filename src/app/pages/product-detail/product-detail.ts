import { Component, DestroyRef, ElementRef, afterNextRender, computed, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { findProduct } from '../../catalog/catalog';
import { formatCop } from '../../catalog/money';
import { ShopifyCheckoutService } from '../../shopify/shopify-checkout.service';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  host: { class: 'view' },
  template: `
    @if (product(); as item) {
      <article class="detail wrap">
        <a class="back" routerLink="/" fragment="catalogo">Volver al catálogo</a>
        <div class="detail-grid">
          <div class="swatch swatch-hero" [style.--accent-h]="item.hue" aria-hidden="true">
            <span class="swatch-ring"></span>
            <span class="swatch-mark">{{ item.mark }}</span>
          </div>
          <div class="detail-copy">
            <p class="eyebrow">{{ item.category }}</p>
            <h1 tabindex="-1" #heading>{{ item.name }}</h1>
            <p class="price price-lg">{{ formatPrice(item.price) }}</p>
            <p class="lede">{{ item.description }}</p>
            <ul class="highlights">
              @for (point of item.highlights; track point) {
                <li>{{ point }}</li>
              }
            </ul>

            <section class="pay-panel" aria-labelledby="pago-titulo">
              <p class="eyebrow">Método de esta prueba</p>
              <h2 id="pago-titulo">Pago contraentrega</h2>
              <p>
                Confirmas aquí y abonas en efectivo cuando te entregan. Shopify guarda la orden con
                esa nota para que puedas seguirla en el administrador.
              </p>
              <div class="buy-row">
                <div class="stepper" role="group" aria-label="Cantidad">
                  <button
                    type="button"
                    (click)="decrease()"
                    [disabled]="quantity() <= 1 || status() === 'loading'"
                    aria-label="Reducir cantidad"
                  >
                    −
                  </button>
                  <span aria-live="polite">{{ quantity() }}</span>
                  <button
                    type="button"
                    (click)="increase()"
                    [disabled]="quantity() >= 5 || status() === 'loading'"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  class="btn btn-primary"
                  (click)="buy()"
                  [disabled]="status() === 'loading'"
                  [attr.aria-busy]="status() === 'loading'"
                >
                  @if (status() === 'loading') {
                    Conectando con Shopify…
                  } @else {
                    Comprar ahora
                  }
                </button>
              </div>
              <p class="total">
                Total de esta prueba:
                <strong>{{ formatPrice(item.price * quantity()) }}</strong>
              </p>
              @if (message()) {
                <p class="form-error" role="alert">{{ message() }}</p>
              }
              <p class="fine">
                Continuar abre el checkout de tu tienda. Activa “Pago contra entrega” en los pagos
                de Shopify para cerrar el pedido sin tarjeta.
              </p>
            </section>
          </div>
        </div>
      </article>
    } @else {
      <section class="wrap missing">
        <p class="eyebrow">Catálogo</p>
        <h1>No encontramos esa pieza.</h1>
        <a class="btn btn-primary" routerLink="/">Volver al inicio</a>
      </section>
    }
  `,
})
export class ProductDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly checkout = inject(ShopifyCheckoutService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly params = toSignal(this.route.paramMap);
  private readonly heading = viewChild<ElementRef<HTMLHeadingElement>>('heading');

  protected readonly formatPrice = formatCop;
  protected readonly quantity = signal(1);
  protected readonly status = signal<'idle' | 'loading' | 'error'>('idle');
  protected readonly message = signal('');
  protected readonly product = computed(() => findProduct(this.params()?.get('slug') ?? ''));

  constructor() {
    effect(() => {
      const item = this.product();
      this.title.setTitle(item ? `${item.name} · Galaxion` : 'Producto no encontrado · Galaxion');
      untracked(() => {
        this.quantity.set(1);
        this.status.set('idle');
        this.message.set('');
      });
    });

    afterNextRender(() => {
      this.heading()?.nativeElement.focus({ preventScroll: true });
    });
  }

  protected increase(): void {
    this.quantity.update((value) => Math.min(5, value + 1));
  }

  protected decrease(): void {
    this.quantity.update((value) => Math.max(1, value - 1));
  }

  protected buy(): void {
    const item = this.product();
    if (!item || this.status() === 'loading') {
      return;
    }

    this.status.set('loading');
    this.message.set('');
    this.checkout
      .startCheckout(item, this.quantity())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (url) => {
          if (!url.startsWith('https://')) {
            this.status.set('error');
            this.message.set('Shopify devolvió un enlace de checkout que no es válido.');
            return;
          }
          window.location.assign(url);
        },
        error: (error: unknown) => {
          this.status.set('error');
          this.message.set(
            error instanceof Error ? error.message : 'No se pudo abrir Shopify.',
          );
        },
      });
  }
}
