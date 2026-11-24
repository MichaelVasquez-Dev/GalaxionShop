import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Product } from '../catalog/product';
import { shopifyConfig } from './shopify.config';

const CHECKOUT_NOTE = 'Pago contraentrega';

interface CartCreateBody {
  data?: {
    cartCreate?: {
      cart?: { checkoutUrl?: string | null } | null;
      userErrors?: { message?: string | null }[];
    } | null;
  };
  errors?: { message?: string | null }[];
}

export function normalizeShopDomain(value: string): string {
  return value
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .replace(/\.$/, '')
    .toLowerCase();
}

function numericVariantId(value: string): string | null {
  const trimmed = value.trim();
  if (/^\d+$/.test(trimmed)) {
    return trimmed;
  }
  const match = /ProductVariant\/(\d+)/.exec(trimmed);
  return match?.[1] ?? null;
}

function variantGid(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith('gid://')) {
    return trimmed;
  }
  return `gid://shopify/ProductVariant/${trimmed}`;
}

function cleanMessages(messages: (string | null | undefined)[]): string[] {
  return messages
    .map((message) => (message ?? '').trim())
    .filter((message) => message.length > 0);
}

@Injectable({ providedIn: 'root' })
export class ShopifyCheckoutService {
  private readonly http = inject(HttpClient);

  startCheckout(product: Product, quantity: number): Observable<string> {
    const domain = normalizeShopDomain(shopifyConfig.shopDomain);
    const token = shopifyConfig.storefrontAccessToken.trim();
    const variantId = product.shopifyVariantId.trim();
    const qty = Math.min(5, Math.max(1, Math.trunc(quantity) || 1));

    if (!variantId) {
      return throwError(
        () =>
          new Error(
            'Este producto no tiene ID de variante. Pégalo en src/app/catalog/catalog.ts, en shopifyVariantId.',
          ),
      );
    }

    if (!domain) {
      return throwError(
        () =>
          new Error(
            'Falta el dominio de tu tienda. Escríbelo en src/app/shopify/shopify.config.ts, por ejemplo tu-tienda.myshopify.com.',
          ),
      );
    }

    if (!token) {
      try {
        return of(this.cartPermalink(domain, variantId, qty));
      } catch (error: unknown) {
        const reason = error instanceof Error ? error : new Error('No se pudo armar el carrito.');
        return throwError(() => reason);
      }
    }

    return this.createStorefrontCheckout(domain, token, variantId, qty);
  }

  private cartPermalink(domain: string, variantId: string, quantity: number): string {
    const numeric = numericVariantId(variantId);
    if (!numeric) {
      throw new Error(
        'El ID de variante tiene que ser el número de Shopify, o un gid://shopify/ProductVariant/…, para abrir el carrito.',
      );
    }

    const url = new URL(`https://${domain}/cart/${numeric}:${quantity}`);
    url.searchParams.set('note', CHECKOUT_NOTE);
    url.searchParams.set('attributes[Metodo de pago]', CHECKOUT_NOTE);
    return url.toString();
  }

  private createStorefrontCheckout(
    domain: string,
    token: string,
    variantId: string,
    quantity: number,
  ): Observable<string> {
    const endpoint = `https://${domain}/api/${shopifyConfig.apiVersion}/graphql.json`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    });

    return this.http
      .post<CartCreateBody>(
        endpoint,
        {
          query: `mutation CartCreate($input: CartInput!) {
            cartCreate(input: $input) {
              cart { checkoutUrl }
              userErrors { message }
            }
          }`,
          variables: {
            input: {
              note: CHECKOUT_NOTE,
              attributes: [{ key: 'Metodo de pago', value: CHECKOUT_NOTE }],
              lines: [{ merchandiseId: variantGid(variantId), quantity }],
            },
          },
        },
        { headers },
      )
      .pipe(
        map((body) => {
          const created = body.data?.cartCreate;
          const reasons = cleanMessages([
            ...(created?.userErrors ?? []).map((error) => error.message),
            ...(body.errors ?? []).map((error) => error.message),
          ]);
          const checkoutUrl = created?.cart?.checkoutUrl;
          if (!checkoutUrl) {
            throw new Error(
              reasons[0] ??
                'Shopify no devolvió el checkout. Revisa el token de Storefront, el ID de variante y que el producto esté publicado en el canal Headless.',
            );
          }
          return checkoutUrl;
        }),
        catchError((error: unknown) => {
          if (error instanceof Error && !(error instanceof HttpErrorResponse)) {
            return throwError(() => error);
          }
          const status = error instanceof HttpErrorResponse ? ` (${error.status})` : '';
          return throwError(
            () =>
              new Error(
                `No pudimos crear el pedido en Shopify${status}. Revisa el dominio, el token público de Storefront y la versión de API en shopify.config.ts.`,
              ),
          );
        }),
      );
  }
}
