"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

const placeholderImage = "/img/image 52.png";

export type ResultadoCarrito =
  | { success: true }
  | { success: false; error: string };

export type CarritoItemView = {
  id: string;
  productId: string;
  quantity: number;
  stock: number;
  minOrderQty: number;
  unitPrice: number;
  subtotal: number;
  isActive: boolean;
  product: {
    title: string;
    description: string;
    image: string;
    category: string;
    provider: string;
  };
};

export type ProductoFavoritoView = {
  id: string;
  title: string;
  price: string;
  img: string;
  category: string;
  description: string;
  gallery: string[];
  specs: string[];
  stock: number;
  minOrderQty: number;
};

async function getBuyerId() {
  const session = await getSession();
  if (!session || session.role !== "BUYER") return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, role: true },
  });

  return user?.role === "BUYER" ? user.id : null;
}

async function requireBuyer() {
  const userId = await getBuyerId();
  if (!userId) redirect("/login_usuario");
  return userId;
}

function getUnitPrice(
  basePrice: number,
  wholesaleTiers: {
    minQuantity: number;
    maxQuantity: number | null;
    unitPrice: number;
  }[],
  quantity: number,
) {
  const tier = wholesaleTiers.find(
    (current) =>
      quantity >= current.minQuantity &&
      (current.maxQuantity === null || quantity <= current.maxQuantity),
  );
  return tier?.unitPrice ?? basePrice;
}

function formatPrice(price: number) {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
  return `$${formatted} MXN`;
}

export async function agregarAlCarrito(
  productId: string,
  cantidad: number,
): Promise<ResultadoCarrito> {
  const userId = await requireBuyer();

  if (typeof productId !== "string" || !productId.trim()) {
    return { success: false, error: "El producto seleccionado no es válido." };
  }
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    return { success: false, error: "La cantidad debe ser un entero positivo." };
  }

  const result = await prisma.$transaction(async (transaction) => {
    const product = await transaction.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        isActive: true,
        stock: true,
        minOrderQty: true,
      },
    });

    if (!product || !product.isActive) {
      return { success: false as const, error: "El producto ya no está disponible." };
    }

    const currentCart = await transaction.cart.findUnique({
      where: { userId },
      select: { id: true },
    });
    const existing = currentCart
      ? await transaction.cartItem.findFirst({
          where: { cartId: currentCart.id, productId: product.id },
          select: { id: true, quantity: true },
        })
      : null;
    const newQuantity = (existing?.quantity ?? 0) + cantidad;

    if (newQuantity < product.minOrderQty) {
      return {
        success: false as const,
        error: `La cantidad mínima para este producto es ${product.minOrderQty}.`,
      };
    }
    if (newQuantity > product.stock) {
      return {
        success: false as const,
        error: `Solo hay ${product.stock} unidades disponibles.`,
      };
    }

    if (existing) {
      await transaction.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQuantity },
      });
    } else {
      const cart =
        currentCart ??
        (await transaction.cart.upsert({
          where: { userId },
          create: { userId },
          update: {},
          select: { id: true },
        }));
      await transaction.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          quantity: newQuantity,
        },
      });
    }

    return { success: true as const };
  });

  if (result.success) revalidatePath("/carrito");
  return result;
}

export async function cambiarCantidad(
  itemId: string,
  cantidad: number,
): Promise<ResultadoCarrito> {
  const userId = await requireBuyer();

  if (typeof itemId !== "string" || !itemId.trim()) {
    return { success: false, error: "El artículo del carrito no es válido." };
  }
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    return { success: false, error: "La cantidad debe ser un entero positivo." };
  }

  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cart: { userId } },
    select: {
      id: true,
      product: {
        select: {
          isActive: true,
          stock: true,
          minOrderQty: true,
        },
      },
    },
  });

  if (!item) {
    return { success: false, error: "No se encontró el artículo en tu carrito." };
  }
  if (!item.product.isActive) {
    return { success: false, error: "El producto ya no está disponible." };
  }
  if (cantidad < item.product.minOrderQty) {
    return {
      success: false,
      error: `La cantidad mínima para este producto es ${item.product.minOrderQty}.`,
    };
  }
  if (cantidad > item.product.stock) {
    return {
      success: false,
      error: `Solo hay ${item.product.stock} unidades disponibles.`,
    };
  }

  await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity: cantidad },
  });
  revalidatePath("/carrito");
  return { success: true };
}

export async function quitarDelCarrito(
  itemId: string,
): Promise<ResultadoCarrito> {
  const userId = await requireBuyer();
  if (typeof itemId !== "string" || !itemId.trim()) {
    return { success: false, error: "El artículo del carrito no es válido." };
  }

  const result = await prisma.cartItem.deleteMany({
    where: { id: itemId, cart: { userId } },
  });

  if (result.count === 0) {
    return { success: false, error: "No se encontró el artículo en tu carrito." };
  }

  revalidatePath("/carrito");
  return { success: true };
}

export async function obtenerCarrito(): Promise<CarritoItemView[]> {
  const userId = await getBuyerId();
  if (!userId) return [];

  const cart = await prisma.cart.findUnique({
    where: { userId },
    select: {
      items: {
        include: {
          product: {
            select: {
              title: true,
              description: true,
              images: true,
              stock: true,
              minOrderQty: true,
              isActive: true,
              basePrice: true,
              category: { select: { name: true } },
              company: { select: { legalName: true } },
              wholesaleTiers: {
                select: {
                  minQuantity: true,
                  maxQuantity: true,
                  unitPrice: true,
                },
                orderBy: { minQuantity: "desc" },
              },
            },
          },
        },
      },
    },
  });

  return (cart?.items ?? []).map((item) => {
    const unitPrice = getUnitPrice(
      item.product.basePrice,
      item.product.wholesaleTiers,
      item.quantity,
    );

    return {
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      stock: item.product.stock,
      minOrderQty: item.product.minOrderQty,
      unitPrice,
      subtotal: unitPrice * item.quantity,
      isActive: item.product.isActive,
      product: {
        title: item.product.title,
        description: item.product.description,
        image: item.product.images[0] ?? placeholderImage,
        category: item.product.category.name,
        provider: item.product.company.legalName,
      },
    };
  });
}

export async function toggleFavorito(
  productId: string,
): Promise<ResultadoCarrito & { isFavorite?: boolean }> {
  const userId = await requireBuyer();
  if (typeof productId !== "string" || !productId.trim()) {
    return { success: false, error: "El producto seleccionado no es válido." };
  }

  const product = await prisma.product.findFirst({
    where: { id: productId, isActive: true },
    select: { id: true },
  });
  if (!product) {
    return { success: false, error: "El producto ya no está disponible." };
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId, productId: product.id } },
    select: { id: true },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    revalidatePath("/favoritos");
    return { success: true, isFavorite: false };
  }

  await prisma.favorite.create({ data: { userId, productId: product.id } });
  revalidatePath("/favoritos");
  return { success: true, isFavorite: true };
}

export async function obtenerFavoritos(): Promise<ProductoFavoritoView[]> {
  const userId = await getBuyerId();
  if (!userId) return [];

  const favorites = await prisma.favorite.findMany({
    where: { userId, product: { isActive: true } },
    select: {
      product: {
        select: {
          id: true,
          title: true,
          basePrice: true,
          description: true,
          images: true,
          medidas: true,
          colores: true,
          modelos: true,
          stock: true,
          minOrderQty: true,
          category: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return favorites.map(({ product }) => {
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
      minOrderQty: product.minOrderQty,
    };
  });
}
