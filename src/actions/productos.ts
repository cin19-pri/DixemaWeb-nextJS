"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export type CategoriaProducto = {
  id: string;
  name: string;
};

export type DatosNuevoProducto = {
  titulo: string;
  descripcion: string;
  precioMenudeo: string;
  precioMayoreo: string;
  cantidadMinimaMayoreo: string;
  stock: string;
  categoriaId: string;
  imagen: string;
  medidas: string;
  colores: string;
  modelos: string;
};

export type ResultadoCrearProducto =
  | { success: true }
  | { success: false; error: string };

export type ResultadoAccionProducto =
  | { success: true }
  | { success: false; error: string };

function separarValores(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function leerTexto(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function esImagenCloudinary(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "res.cloudinary.com" &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export async function obtenerCategorias(): Promise<
  | { success: true; categorias: CategoriaProducto[] }
  | { success: false; error: string }
> {
  const session = await getSession();
  if (!session || session.role !== "SELLER") {
    return { success: false, error: "Debes iniciar sesión como proveedor." };
  }

  const categorias = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return { success: true, categorias };
}

export async function crearProducto(
  datos: DatosNuevoProducto,
): Promise<ResultadoCrearProducto> {
  const session = await getSession();
  if (!session || session.role !== "SELLER") {
    return { success: false, error: "No tienes permiso para crear productos." };
  }

  if (!datos || typeof datos !== "object") {
    return { success: false, error: "Los datos del producto no son válidos." };
  }

  const titulo = leerTexto(datos.titulo);
  const descripcion = leerTexto(datos.descripcion);
  const precioMenudeoTexto = leerTexto(datos.precioMenudeo);
  const stockTexto = leerTexto(datos.stock);
  const precioMenudeo = Number(precioMenudeoTexto);
  const stock = Number(stockTexto);
  const categoriaId = leerTexto(datos.categoriaId);
  const imagen = leerTexto(datos.imagen);
  const precioMayoreoIngresado = leerTexto(datos.precioMayoreo);
  const cantidadMinimaIngresada = leerTexto(datos.cantidadMinimaMayoreo);
  const precioMayoreo = precioMayoreoIngresado
    ? Number(precioMayoreoIngresado)
    : null;
  const cantidadMinimaMayoreo = cantidadMinimaIngresada
    ? Number(cantidadMinimaIngresada)
    : null;

  if (!titulo) {
    return { success: false, error: "Escribe el título del producto." };
  }
  if (!descripcion) {
    return { success: false, error: "Escribe la descripción del producto." };
  }
  if (
    !precioMenudeoTexto ||
    !Number.isFinite(precioMenudeo) ||
    precioMenudeo <= 0
  ) {
    return { success: false, error: "El precio de menudeo debe ser mayor que 0." };
  }
  if (!stockTexto || !Number.isInteger(stock) || stock < 0) {
    return {
      success: false,
      error: "El stock debe ser un número entero igual o mayor que 0.",
    };
  }
  if (!categoriaId) {
    return { success: false, error: "Selecciona una categoría." };
  }
  if (!esImagenCloudinary(imagen)) {
    return {
      success: false,
      error: "Sube una imagen válida antes de guardar el producto.",
    };
  }
  if (
    precioMayoreo !== null &&
    (!Number.isFinite(precioMayoreo) || precioMayoreo <= 0)
  ) {
    return {
      success: false,
      error: "El precio de mayoreo debe ser mayor que 0.",
    };
  }
  if (
    precioMayoreo !== null &&
    (cantidadMinimaMayoreo === null ||
      !Number.isInteger(cantidadMinimaMayoreo) ||
      cantidadMinimaMayoreo < 1)
  ) {
    return {
      success: false,
      error: "Indica una cantidad mínima válida para el precio de mayoreo.",
    };
  }

  const [user, categoria] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, companyId: true, role: true },
    }),
    prisma.category.findUnique({
      where: { id: categoriaId },
      select: { id: true },
    }),
  ]);

  if (!user || user.role !== "SELLER") {
    return { success: false, error: "No se encontró una cuenta de proveedor válida." };
  }
  if (!categoria) {
    return { success: false, error: "La categoría seleccionada ya no existe." };
  }

  const slugBase =
    titulo
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "producto";

  await prisma.$transaction(async (transaction) => {
    let companyId = user.companyId;
    if (!companyId) {
      const company = await transaction.company.create({
        data: { legalName: user.name },
        select: { id: true },
      });
      companyId = company.id;
      await transaction.user.update({
        where: { id: user.id },
        data: { companyId },
      });
    }

    let slug = "";
    do {
      slug = `${slugBase}-${randomBytes(3).toString("hex")}`;
    } while (await transaction.product.findUnique({ where: { slug } }));

    await transaction.product.create({
      data: {
        title: titulo,
        description: descripcion,
        basePrice: precioMenudeo,
        stock,
        categoryId: categoria.id,
        companyId,
        images: [imagen],
        medidas: separarValores(leerTexto(datos.medidas)),
        colores: separarValores(leerTexto(datos.colores)),
        modelos: separarValores(leerTexto(datos.modelos)),
        slug,
        ...(precioMayoreo !== null && cantidadMinimaMayoreo !== null
          ? {
              wholesaleTiers: {
                create: {
                  unitPrice: precioMayoreo,
                  minQuantity: cantidadMinimaMayoreo,
                },
              },
            }
          : {}),
      },
    });
  });

  revalidatePath("/gestion_producto");
  revalidatePath("/categorias");

  return { success: true };
}

async function obtenerEmpresaDelProveedor(): Promise<
  | { success: true; companyId: string }
  | { success: false; error: string }
> {
  const session = await getSession();
  if (!session || session.role !== "SELLER") {
    return { success: false, error: "No tienes permiso para modificar productos." };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { companyId: true, role: true },
  });

  if (!user || user.role !== "SELLER" || !user.companyId) {
    return {
      success: false,
      error: "Tu cuenta de proveedor no tiene una empresa vinculada.",
    };
  }

  return { success: true, companyId: user.companyId };
}

export async function eliminarProducto(
  id: string,
): Promise<ResultadoAccionProducto> {
  const empresa = await obtenerEmpresaDelProveedor();
  if (!empresa.success) return empresa;
  if (typeof id !== "string" || !id.trim()) {
    return { success: false, error: "El producto indicado no es válido." };
  }

  const resultado = await prisma.$transaction(async (transaction) => {
    const producto = await transaction.product.findFirst({
      where: { id, companyId: empresa.companyId },
      select: {
        id: true,
        _count: { select: { orderItems: true } },
      },
    });

    if (!producto) {
      return {
        success: false as const,
        error: "No se encontró el producto en tu catálogo.",
      };
    }

    if (producto._count.orderItems > 0) {
      const actualizacion = await transaction.product.updateMany({
        where: { id: producto.id, companyId: empresa.companyId },
        data: { isActive: false },
      });
      if (actualizacion.count === 0) {
        return {
          success: false as const,
          error: "No se encontró el producto en tu catálogo.",
        };
      }
    } else {
      await transaction.cartItem.deleteMany({
        where: { productId: producto.id },
      });
      await transaction.quoteItem.deleteMany({
        where: { productId: producto.id },
      });
      const eliminacion = await transaction.product.deleteMany({
        where: { id: producto.id, companyId: empresa.companyId },
      });
      if (eliminacion.count === 0) {
        return {
          success: false as const,
          error: "No se encontró el producto en tu catálogo.",
        };
      }
    }

    return { success: true as const };
  });

  if (!resultado.success) return resultado;
  revalidatePath("/gestion_producto");
  revalidatePath("/categorias");
  return resultado;
}

export async function actualizarStock(
  id: string,
  stock: number,
): Promise<ResultadoAccionProducto> {
  const empresa = await obtenerEmpresaDelProveedor();
  if (!empresa.success) return empresa;
  if (typeof id !== "string" || !id.trim()) {
    return { success: false, error: "El producto indicado no es válido." };
  }
  if (!Number.isInteger(stock) || stock < 0) {
    return {
      success: false,
      error: "El stock debe ser un número entero igual o mayor que 0.",
    };
  }

  const resultado = await prisma.product.updateMany({
    where: { id, companyId: empresa.companyId },
    data: { stock },
  });

  if (resultado.count === 0) {
    return { success: false, error: "No se encontró el producto en tu catálogo." };
  }

  revalidatePath("/gestion_producto");
  revalidatePath("/categorias");
  return { success: true };
}
