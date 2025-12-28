export type ProductVariant = {
  id: string;
  name: string;
  size: string;
  price: number;
};

export type ProductImage = {
  src: string;
  alt: string;
};

export type Product = {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  leadTime: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  images: ProductImage[];
  variants: ProductVariant[];
};

export const products: Product[] = [
  {
    slug: "colchon-nube-ivory",
    name: "Colchon Nube Ivory",
    description: "Colchon equilibrado para uso diario con sensacion suave.",
    longDescription:
      "Equilibrio entre confort y soporte para descansar sin hundimientos. Pensado para quienes buscan suavidad con una base estable, ideal para uso diario.",
    leadTime: "Entrega 5-7 dias",
    highlights: [
      "Altura 25 cm",
      "Nucleo HR de alta densidad",
      "Tejido transpirable",
    ],
    included: [
      "Colchon envasado y protegido",
      "Entrega a domicilio",
    ],
    notIncluded: [
      "Retirada de colchon antiguo",
      "Montaje especial",
    ],
    images: [
      {
        src: "/products/colchon-nube-ivory.svg",
        alt: "Colchon Nube Ivory",
      },
    ],
    variants: [
      {
        id: "nube-135",
        name: "135x190",
        size: "135 x 190 cm",
        price: 329,
      },
      {
        id: "nube-150",
        name: "150x200",
        size: "150 x 200 cm",
        price: 379,
      },
    ],
  },
  {
    slug: "colchon-visco-balance",
    name: "Colchon Visco Balance",
    description: "Viscoelastica suave con soporte firme en zona lumbar.",
    longDescription:
      "Capa viscoelastica que alivia presion con refuerzo lumbar para mantener la postura. Una sensacion acogedora sin perder firmeza.",
    leadTime: "Entrega 6-8 dias",
    highlights: [
      "Altura 27 cm",
      "Capa viscoelastica adaptable",
      "Refuerzo perimetral",
    ],
    included: [
      "Colchon envasado y protegido",
      "Entrega a domicilio",
    ],
    notIncluded: [
      "Retirada de colchon antiguo",
      "Subida sin ascensor",
    ],
    images: [
      {
        src: "/products/colchon-visco-balance.svg",
        alt: "Colchon Visco Balance",
      },
    ],
    variants: [
      {
        id: "visco-135",
        name: "135x190",
        size: "135 x 190 cm",
        price: 399,
      },
      {
        id: "visco-150",
        name: "150x200",
        size: "150 x 200 cm",
        price: 449,
      },
    ],
  },
  {
    slug: "colchon-firmeza-clara",
    name: "Colchon Firmeza Clara",
    description: "Soporte firme para quienes buscan estabilidad total.",
    longDescription:
      "Modelo de firmeza alta con respuesta estable en todo el largo. Adecuado si prefieres un descanso sin hundimiento y con soporte claro.",
    leadTime: "Entrega 5-7 dias",
    highlights: [
      "Altura 24 cm",
      "Firmeza alta",
      "Tejido stretch",
    ],
    included: [
      "Colchon envasado y protegido",
      "Entrega a domicilio",
    ],
    notIncluded: [
      "Retirada de colchon antiguo",
      "Montaje especial",
    ],
    images: [
      {
        src: "/products/colchon-firmeza-clara.svg",
        alt: "Colchon Firmeza Clara",
      },
    ],
    variants: [
      {
        id: "firmeza-90",
        name: "90x190",
        size: "90 x 190 cm",
        price: 249,
      },
      {
        id: "firmeza-135",
        name: "135x190",
        size: "135 x 190 cm",
        price: 319,
      },
    ],
  },
  {
    slug: "canape-liso-compacto",
    name: "Canape Liso Compacto",
    description: "Canape abatible con almacenaje y apertura asistida.",
    longDescription:
      "Canape con espacio de almacenaje util y apertura frontal con ayuda. Una base sencilla para ganar capacidad sin mecanismos complejos.",
    leadTime: "Entrega 8-10 dias",
    highlights: [
      "Apertura frontal",
      "Estructura reforzada",
      "Tejido antiaranazos",
    ],
    included: [
      "Canape desmontado",
      "Herrajes y manual",
    ],
    notIncluded: [
      "Montaje a domicilio",
      "Retirada de base antigua",
    ],
    images: [
      {
        src: "/products/canape-liso-compacto.svg",
        alt: "Canape Liso Compacto",
      },
    ],
    variants: [
      {
        id: "canape-135",
        name: "135x190",
        size: "135 x 190 cm",
        price: 459,
      },
      {
        id: "canape-150",
        name: "150x200",
        size: "150 x 200 cm",
        price: 499,
      },
    ],
  },
  {
    slug: "cama-articulada-zen",
    name: "Cama Articulada Zen",
    description: "Base articulada con motor silencioso y mando.",
    longDescription:
      "Base articulada con varios planos para ajustar la postura. Motor silencioso con mando con cable para un uso estable y simple.",
    leadTime: "Entrega 10-12 dias",
    highlights: [
      "Motor silencioso",
      "Lamas de madera",
      "5 planos de articulacion",
    ],
    included: [
      "Base articulada",
      "Mando con cable",
    ],
    notIncluded: [
      "Colchon articulable",
      "Montaje a domicilio",
    ],
    images: [
      {
        src: "/products/cama-articulada-zen.svg",
        alt: "Cama Articulada Zen",
      },
    ],
    variants: [
      {
        id: "zen-90",
        name: "90x190",
        size: "90 x 190 cm",
        price: 599,
      },
      {
        id: "zen-105",
        name: "105x190",
        size: "105 x 190 cm",
        price: 649,
      },
    ],
  },
  {
    slug: "canape-orizo-robusto",
    name: "Canape Orizo Robusto",
    description: "Canape de gran capacidad con apertura suave.",
    longDescription:
      "Pensado para quienes necesitan mas almacenaje. Estructura robusta y apertura suave para uso frecuente sin esfuerzo.",
    leadTime: "Entrega 8-10 dias",
    highlights: [
      "Gran capacidad",
      "Apertura suave asistida",
      "Estructura reforzada",
    ],
    included: [
      "Canape desmontado",
      "Herrajes y manual",
    ],
    notIncluded: [
      "Montaje a domicilio",
      "Retirada de base antigua",
    ],
    images: [
      {
        src: "/products/canape-orizo-robusto.svg",
        alt: "Canape Orizo Robusto",
      },
    ],
    variants: [
      {
        id: "orizo-135",
        name: "135x190",
        size: "135 x 190 cm",
        price: 479,
      },
      {
        id: "orizo-150",
        name: "150x200",
        size: "150 x 200 cm",
        price: 529,
      },
    ],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
