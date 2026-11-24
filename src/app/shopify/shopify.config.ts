/**
 * Conexión de prueba con Shopify.
 *
 * 1. En el admin de Shopify crea una app con acceso a la Storefront API
 *    (canal Headless) y copia el token público. No pegues aquí un token
 *    de la Admin API: ese secreto no puede vivir en el navegador.
 * 2. El dominio de la tienda va en `shopDomain`, sin https.
 * 3. Cuando existan productos en Shopify, pega el ID de variante en `catalog.ts`.
 * 4. En Configuración → Pagos, activa el método manual
 *    "Pago contra entrega" y, si quieres forzar esa prueba, deja solo ese método.
 *
 * Comprar ahora crea un carrito con la nota "Pago contraentrega" y abre
 * el checkout. Cuando el cliente termina, el pedido queda en Shopify.
 */
export const shopifyConfig = {
  shopDomain: '1iyf-aq77gu-aa.myshopify.com',
  storefrontAccessToken: '',
  apiVersion: '2026-10',
};
