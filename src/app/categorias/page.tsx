import prisma from "@/lib/prisma";
import CategoriasClient, {
  type CategoriaCatalogo,
  type ProductoCatalogo,
} from "./categorias-client";

const categoryImagesBySlug: Record<string, string> = {
  aspiradora: "/img/aspiradoras de mano.png",
  audifonos: "/img/audifonos.png",
  calcetines: "/img/calcetines.png",
  "cascos-de-seguridad": "/img/cascos de seguridad.png",
  "correas-para-perros": "/img/correas de perros.png",
  cuadernos: "/img/cuadernos.png",
  detergente: "/img/detergente.png",
  juguetes: "/img/juguetes.png",
  martillos: "/img/martillos.png",
  "paletas-de-sombras": "/img/paletas de sombras.png",
  pulceras: "/img/pulceras.png",
  sartenes: "/img/sartenes.png",
  "tiras-led": "/img/tiras led.png",
  toallas: "/img/toallas.png",
  tuppers: "/img/tuppers.png",
};

const placeholderImage = "/img/image 52.png";

function categoryKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatPrice(price: number) {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  return `$${formatted} MXN`;
}

export default async function CategoriasPage() {
  const [products, categories, productCounts] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, stock: { gt: 0 } },
      select: {
        id: true,
        title: true,
        description: true,
        basePrice: true,
        stock: true,
        minOrderQty: true,
        images: true,
        medidas: true,
        colores: true,
        modelos: true,
        category: { select: { name: true } },
        wholesaleTiers: {
          select: {
            id: true,
            minQuantity: true,
            maxQuantity: true,
            unitPrice: true,
          },
          orderBy: { minQuantity: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
    prisma.product.groupBy({
      by: ["categoryId"],
      where: { isActive: true },
      _count: { _all: true },
    }),
  ]);

  const countByCategory = new Map(
    productCounts.map(({ categoryId, _count }) => [
      categoryId,
      _count._all,
    ]),
  );

  const categoryProps: CategoriaCatalogo[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    items: countByCategory.get(category.id) ?? 0,
    img:
      categoryImagesBySlug[category.slug] ??
      categoryImagesBySlug[categoryKey(category.name)] ??
      placeholderImage,
  }));

  const productProps: ProductoCatalogo[] = products.map((product) => {
    const gallery = product.images.length
      ? product.images
      : [placeholderImage];

    return {
      id: product.id,
      title: product.title,
      price: formatPrice(product.basePrice),
      img: gallery[0],
      category: product.category.name,
      description: product.description,
      gallery,
      specs: [...product.medidas, ...product.colores, ...product.modelos],
      stock: product.stock,
      wholesaleTiers: product.wholesaleTiers,
      minOrderQty: product.minOrderQty,
    };
  });

  return (
    <CategoriasClient products={productProps} categories={categoryProps} />
  );
}
