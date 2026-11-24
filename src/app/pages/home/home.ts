import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { products } from '../../catalog/catalog';
import { formatCop } from '../../catalog/money';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  host: { class: 'view' },
  template: `
    <section class="hero wrap">
      <p class="eyebrow">Edición de prueba · 10 piezas</p>
      <h1>Lo que se ve bien <em>de noche.</em></h1>
      <p class="lede">
        Audio, hogar y objetos de uso diario. Eliges la pieza, confirmas el pedido y pagas
        contraentrega cuando llega a la puerta.
      </p>
      <div class="hero-actions">
        <a class="btn btn-primary" routerLink="/" fragment="catalogo">Ver el catálogo</a>
        <a class="btn btn-ghost" routerLink="/" fragment="contraentrega">Cómo se paga</a>
      </div>
      <ul class="promise">
        <li>
          <strong>Contraentrega</strong>
          <span>Pagas al recibir</span>
        </li>
        <li>
          <strong>10 piezas</strong>
          <span>Catálogo de prueba</span>
        </li>
        <li>
          <strong>Shopify</strong>
          <span>Registra el pedido</span>
        </li>
      </ul>
    </section>

    <div class="marquee" aria-hidden="true">
      <div class="marquee-track">
        @for (copy of ticker; track $index) {
          <span>{{ copy }}</span>
        }
      </div>
    </div>

    <section class="wrap steps" id="contraentrega" aria-labelledby="pasos-titulo">
      <div class="section-head">
        <p class="eyebrow">El pedido</p>
        <h2 id="pasos-titulo">Pagas cuando te lo entregan.</h2>
      </div>
      <ol>
        <li>
          <span>01</span>
          <h3>Eliges la pieza</h3>
          <p>Abres el detalle, miras el precio y cuántas unidades quieres.</p>
        </li>
        <li>
          <span>02</span>
          <h3>Comprar ahora</h3>
          <p>El botón abre Shopify con la nota “Pago contraentrega” ya escrita en el pedido.</p>
        </li>
        <li>
          <span>03</span>
          <h3>Cobro en la puerta</h3>
          <p>Terminas el checkout sin tarjeta. El pedido queda en el administrador para seguirlo.</p>
        </li>
      </ol>
    </section>

    <section class="wrap catalog-section" id="catalogo" aria-labelledby="catalogo-titulo">
      <div class="section-head">
        <p class="eyebrow">La selección</p>
        <h2 id="catalogo-titulo">Diez piezas para probar el flujo.</h2>
        <p>Sin fotos todavía: alcanza para validar precios, detalle y el paso a Shopify.</p>
      </div>
      <div class="catalog">
        @for (product of products; track product.slug; let first = $first) {
          <a
            class="product-card"
            [class.product-card-feature]="first"
            [routerLink]="['/producto', product.slug]"
            [style.--accent-h]="product.hue"
            [attr.aria-label]="
              product.name + '. ' + formatPrice(product.price) + '. Ver detalle'
            "
          >
            <span class="swatch" aria-hidden="true">
              <span class="swatch-ring"></span>
              <span class="swatch-mark">{{ product.mark }}</span>
            </span>
            <span class="product-body">
              <span class="product-meta">
                <span>{{ product.category }}</span>
                <span>Pago al recibir</span>
              </span>
              <span class="product-name">{{ product.name }}</span>
              <span class="product-tagline">{{ product.tagline }}</span>
              <span class="product-foot">
                <span class="price">{{ formatPrice(product.price) }}</span>
                <span class="text-link">Ver detalle</span>
              </span>
            </span>
          </a>
        }
      </div>
    </section>
  `,
})
export class HomePage {
  protected readonly products = products;
  protected readonly formatPrice = formatCop;
  protected readonly ticker = [
    'Pago contraentrega',
    'Checkout Shopify',
    'Audio',
    'Hogar',
    'Viaje',
    'Cuidado',
    'Pago contraentrega',
    'Checkout Shopify',
    'Audio',
    'Hogar',
    'Viaje',
    'Cuidado',
  ];

  constructor() {
    inject(Title).setTitle('Galaxion · Tienda');
  }
}
