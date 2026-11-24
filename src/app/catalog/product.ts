export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  category: string;
  /** Tono del bloque visual, en grados HSL. */
  hue: number;
  mark: string;
  highlights: string[];
  /**
   * ID de la variante en Shopify.
   * Acepta el número (1234567890) o el gid completo
   * (gid://shopify/ProductVariant/1234567890).
   */
  shopifyVariantId: string;
}
