import { Product } from './product';

/**
 * Catálogo local de prueba. El precio se muestra en la tienda;
 * Shopify usa la variante indicada al armar el pedido.
 * Pega el ID de cada variante en `shopifyVariantId`.
 */
export const products: Product[] = [
  {
    slug: 'auriculares-nova-pulse',
    name: 'Auriculares Nova Pulse',
    tagline: 'Graves suaves y llamadas claras.',
    description:
      'Pensados para trayectos y tardes largas. Bajan el ruido de fondo sin aislarte del todo, y el estuche recarga mientras van guardados.',
    price: 189900,
    category: 'Audio',
    hue: 272,
    mark: 'NP',
    highlights: ['Almohadillas suaves', '28 horas con el estuche', 'Micrófono para llamadas'],
    shopifyVariantId: '',
  },
  {
    slug: 'reloj-astral-fit',
    name: 'Reloj Astral Fit',
    tagline: 'Ritmo, sueño y pocas alertas.',
    description:
      'Una esfera quieta para el día y la noche. Sigue pasos y descanso sin llenarte de avisos, con una correa que se cambia en un minuto.',
    price: 249900,
    category: 'Wearable',
    hue: 312,
    mark: 'AF',
    highlights: ['Caja ligera', 'Correa intercambiable', 'Resistente al sudor'],
    shopifyVariantId: '',
  },
  {
    slug: 'lampara-orbital',
    name: 'Lámpara Orbital',
    tagline: 'Luz cálida en tres intensidades.',
    description:
      'Una esfera de vidrio mate para el escritorio o la mesa de noche. Se enciende con un toque y se queda en un ámbar bajo.',
    price: 79900,
    category: 'Hogar',
    hue: 258,
    mark: 'OR',
    highlights: ['Tres intensidades', 'Base estable', 'Cable largo'],
    shopifyVariantId: '',
  },
  {
    slug: 'mochila-nebula',
    name: 'Mochila Nébula 20L',
    tagline: 'Cabe el portátil y poco más.',
    description:
      'Silueta compacta para ir y volver. El compartimento acolchado protege un portátil de hasta 14 pulgadas y el bolsillo de atrás queda contra la espalda.',
    price: 139900,
    category: 'Viaje',
    hue: 286,
    mark: 'NB',
    highlights: ['20 litros', 'Bolsillo oculto', 'Tela repelente'],
    shopifyVariantId: '',
  },
  {
    slug: 'botella-eclipse',
    name: 'Botella Eclipse 600',
    tagline: 'Mantiene el frío hasta la tarde.',
    description:
      'Acero de doble pared y tapa que no gotea. El diámetro entra en el portavasos y el acabado oscuro disimula las marcas de uso.',
    price: 49900,
    category: 'Diario',
    hue: 222,
    mark: 'EC',
    highlights: ['600 ml', 'Libre de BPA', 'Tapa hermética'],
    shopifyVariantId: '',
  },
  {
    slug: 'teclado-cosmos',
    name: 'Teclado Cosmos 75',
    tagline: 'Teclas bajas, sonido contenido.',
    description:
      'Formato compacto para escribir sin ocupar el escritorio. La luz de fondo se queda en un violeta muy bajo, fácil de apagar.',
    price: 229900,
    category: 'Tecnología',
    hue: 328,
    mark: 'CS',
    highlights: ['Formato 75%', 'Interruptores silenciosos', 'Cable USB-C'],
    shopifyVariantId: '',
  },
  {
    slug: 'difusor-lunar',
    name: 'Difusor Lunar',
    tagline: 'Vapor fino para el cuarto.',
    description:
      'Un difusor pequeño con apagado automático. Sirve para probar aromas suaves de noche sin dejar la luz encendida.',
    price: 69900,
    category: 'Bienestar',
    hue: 268,
    mark: 'LN',
    highlights: ['Apagado automático', 'Luz tenue', 'Depósito de 200 ml'],
    shopifyVariantId: '',
  },
  {
    slug: 'cargador-gan-65',
    name: 'Cargador GaN 65W',
    tagline: 'Un solo bloque para todo.',
    description:
      'Carga el portátil y el teléfono a la vez. El cuerpo es pequeño, las patas se pliegan y cabe en el bolsillo de la mochila.',
    price: 89900,
    category: 'Tecnología',
    hue: 244,
    mark: 'GN',
    highlights: ['65 W', 'Dos puertos', 'Patas plegables'],
    shopifyVariantId: '',
  },
  {
    slug: 'gafas-velo',
    name: 'Gafas Velo',
    tagline: 'Lente oscuro, montura fina.',
    description:
      'Para el sol de la tarde. La montura es liviana, el filtro corta el UV y el estuche rígido evita que se rayen en la mochila.',
    price: 99900,
    category: 'Accesorios',
    hue: 300,
    mark: 'VL',
    highlights: ['Filtro UV', 'Montura liviana', 'Estuche incluido'],
    shopifyVariantId: '',
  },
  {
    slug: 'set-aurora',
    name: 'Set Aurora',
    tagline: 'Limpieza, suero y crema.',
    description:
      'Tres pasos básicos para la noche. Las texturas son ligeras y el perfume, apenas presente, para poder usarlo seguido.',
    price: 159900,
    category: 'Cuidado',
    hue: 292,
    mark: 'AU',
    highlights: ['Tres pasos', 'Uso nocturno', 'Fragancia suave'],
    shopifyVariantId: '',
  },
];

export function findProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}
