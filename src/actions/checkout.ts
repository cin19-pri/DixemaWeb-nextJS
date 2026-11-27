"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

const RFC_PATTERN = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
const IVA_RATE = 0.16;
const DEFAULT_SHIPPING_PER_PROVIDER = 120;

const cartSelection = {
  items: {
    include: {
      product: {
        select: {
          id: true,
          title: true,
          basePrice: true,
          stock: true,
          minOrderQty: true,
          isActive: true,
          companyId: true,
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
} satisfies Prisma.CartInclude;

type CheckoutDb = Pick<Prisma.TransactionClient, "cart">;

export type CheckoutAddress = {
  id: string;
  companyId: string | null;
  userId: string | null;
  street: string;
  numExt: string;
  numInt: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
};

export type CheckoutAddressInput = Omit<
  CheckoutAddress,
  "id" | "companyId" | "userId" | "isDefault"
>;

export type CheckoutLine = {
  productId: string;
  title: string;
  providerId: string;
  provider: string;
  quantity: number;
  minOrderQty: number;
  stock: number;
  unitPrice: number;
  subtotal: number;
  isActive: boolean;
  validationError: string | null;
};

export type CheckoutData = {
  addresses: CheckoutAddress[];
  lines: CheckoutLine[];
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
  shippingPerProvider: number;
  providerCount: number;
  estimatedDelivery: string;
};

export type CheckoutResult =
  | { success: true; orderId: string; orderNumber: string }
  | { success: false; error: string };

export type CheckoutRequest = {
  addressId: string | null;
  newAddress: CheckoutAddressInput | null;
  requiresInvoice: boolean;
  rfc: string;
};

function roundMoney(amount: number) {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

function getShippingPerProvider() {
  const configuredAmount = process.env.SHIPPING_COST_PER_PROVIDER;
  if (!configuredAmount) return DEFAULT_SHIPPING_PER_PROVIDER;

  const amount = Number(configuredAmount);
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("SHIPPING_COST_PER_PROVIDER debe ser un número no negativo.");
  }
  return amount;
}

function getUnitPrice(
  basePrice: number,
  tiers: {
    minQuantity: number;
    maxQuantity: number | null;
    unitPrice: number;
  }[],
  quantity: number,
) {
  const tier = tiers.find(
    (current) =>
      quantity >= current.minQuantity &&
      (current.maxQuantity === null || quantity <= current.maxQuantity),
  );
  return roundMoney(tier?.unitPrice ?? basePrice);
}

async function getBuyer() {
  const session = await getSession();
  if (!session || session.role !== "BUYER") redirect("/login_usuario");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, role: true, companyId: true },
  });
  if (!user || user.role !== "BUYER") redirect("/login_usuario");
  return user;
}

async function getCart(client: CheckoutDb, userId: string) {
  return client.cart.findUnique({
    where: { userId },
    include: cartSelection,
  });
}

function validateAddressOwnership(companyId: string | null, userId: string | null) {
  if ((companyId === null) === (userId === null)) {
    throw new Error("La dirección debe pertenecer a un usuario o a una empresa, pero no a ambos.");
  }
}

function toCheckoutLines(
  items: NonNullable<Awaited<ReturnType<typeof getCart>>>["items"],
): CheckoutLine[] {
  return items.map((item) => {
    const product = item.product;
    let validationError: string | null = null;
    if (!product.isActive) {
      validationError = `${product.title} ya no está disponible.`;
    } else if (item.quantity < product.minOrderQty) {
      validationError = `${product.title} requiere un pedido mínimo de ${product.minOrderQty}.`;
    } else if (item.quantity > product.stock) {
      validationError = `Solo hay ${product.stock} unidades disponibles de ${product.title}.`;
    }

    const unitPrice = getUnitPrice(
      product.basePrice,
      product.wholesaleTiers,
      item.quantity,
    );

    return {
      productId: product.id,
      title: product.title,
      providerId: product.companyId,
      provider: product.company.legalName,
      quantity: item.quantity,
      minOrderQty: product.minOrderQty,
      stock: product.stock,
      unitPrice,
      subtotal: roundMoney(unitPrice * item.quantity),
      isActive: product.isActive,
      validationError,
    };
  });
}

function calculateTotals(lines: CheckoutLine[], shippingPerProvider: number) {
  const providerCount = new Set(
    lines.filter((line) => line.quantity > 0).map((line) => line.providerId),
  ).size;
  const subtotal = roundMoney(
    lines.reduce((total, line) => total + line.subtotal, 0),
  );
  const shippingCost = roundMoney(providerCount * shippingPerProvider);
  const taxAmount = roundMoney(subtotal * IVA_RATE);
  const totalAmount = roundMoney(subtotal + shippingCost + taxAmount);

  return { subtotal, shippingCost, taxAmount, totalAmount, providerCount };
}

function getEstimatedDelivery() {
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 5);
  return estimatedDate.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export async function obtenerDatosCheckout(): Promise<CheckoutData> {
  const buyer = await getBuyer();
  const shippingPerProvider = getShippingPerProvider();
  const [addresses, cart] = await Promise.all([
    prisma.address.findMany({
      where: {
        isActive: true,
        OR: [
          { userId: buyer.id },
          ...(buyer.companyId ? [{ companyId: buyer.companyId }] : []),
        ],
      },
      select: {
        id: true,
        companyId: true,
        userId: true,
        street: true,
        numExt: true,
        numInt: true,
        neighborhood: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
        isDefault: true,
      },
      orderBy: [{ isDefault: "desc" }, { id: "asc" }],
    }),
    getCart(prisma, buyer.id),
  ]);

  for (const address of addresses) {
    validateAddressOwnership(address.companyId, address.userId);
  }

  const lines = toCheckoutLines(cart?.items ?? []);
  return {
    addresses,
    lines,
    ...calculateTotals(lines, shippingPerProvider),
    shippingPerProvider,
    estimatedDelivery: getEstimatedDelivery(),
  };
}

function normalizeAddress(input: CheckoutAddressInput | null) {
  if (!input || typeof input !== "object") return null;
  const fields = [
    input.street,
    input.numExt,
    input.neighborhood,
    input.city,
    input.state,
    input.zipCode,
  ];
  if (fields.some((value) => typeof value !== "string")) return null;
  if (
    (input.numInt !== null && typeof input.numInt !== "string") ||
    (typeof input.country !== "string" && input.country !== null)
  ) {
    return null;
  }
  const address = {
    street: input.street.trim(),
    numExt: input.numExt.trim(),
    numInt: input.numInt?.trim() || null,
    neighborhood: input.neighborhood.trim(),
    city: input.city.trim(),
    state: input.state.trim(),
    zipCode: input.zipCode.trim(),
    country: input.country.trim() || "México",
  };
  if (
    !address.street ||
    !address.numExt ||
    !address.neighborhood ||
    !address.city ||
    !address.state ||
    !/^\d{5}$/.test(address.zipCode) ||
    Object.values(address).some((value) => typeof value === "string" && value.length > 120)
  ) {
    return null;
  }
  return address;
}

export async function crearPedido(
  request: CheckoutRequest,
): Promise<CheckoutResult> {
  const buyer = await getBuyer();
  if (!request || typeof request !== "object") {
    return { success: false, error: "Los datos del checkout no son válidos." };
  }
  if (
    request.addressId !== null &&
    typeof request.addressId !== "string"
  ) {
    return { success: false, error: "La dirección seleccionada no es válida." };
  }
  if (typeof request.requiresInvoice !== "boolean") {
    return { success: false, error: "Indica si necesitas factura." };
  }

  const rfc = typeof request.rfc === "string" ? request.rfc.trim().toUpperCase() : "";
  if (request.requiresInvoice && !RFC_PATTERN.test(rfc)) {
    return { success: false, error: "El RFC debe tener formato válido (12 o 13 caracteres)." };
  }

  const addressInput = normalizeAddress(request.newAddress);
  if (!request.addressId && !addressInput) {
    return {
      success: false,
      error: "Completa una dirección válida; el código postal debe tener 5 dígitos.",
    };
  }

  const shippingPerProvider = getShippingPerProvider();
  const result = await prisma.$transaction(async (transaction) => {
    const cart = await getCart(transaction, buyer.id);
    if (!cart || cart.items.length === 0) {
      return { success: false as const, error: "Tu carrito está vacío." };
    }

    const lines = toCheckoutLines(cart.items);
    const invalidLine = lines.find((line) => line.validationError);
    if (invalidLine?.validationError) {
      return { success: false as const, error: invalidLine.validationError };
    }

    let addressId = request.addressId;
    if (addressId) {
      const address = await transaction.address.findFirst({
        where: {
          id: addressId,
          isActive: true,
          OR: [
            { userId: buyer.id },
            ...(buyer.companyId ? [{ companyId: buyer.companyId }] : []),
          ],
        },
        select: { id: true, companyId: true, userId: true },
      });
      if (!address) {
        return {
          success: false as const,
          error: "La dirección seleccionada no está disponible para tu cuenta.",
        };
      }
      validateAddressOwnership(address.companyId, address.userId);
    } else if (addressInput) {
      const companyId = null;
      const userId = buyer.id;
      validateAddressOwnership(companyId, userId);
      const address = await transaction.address.create({
        data: {
          ...addressInput,
          companyId,
          userId,
          isDefault: false,
        },
        select: { id: true },
      });
      addressId = address.id;
    }

    if (!addressId) {
      return { success: false as const, error: "No se pudo guardar la dirección." };
    }

    const totals = calculateTotals(lines, shippingPerProvider);
    const orderNumber = `DX-${randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`;
    const order = await transaction.order.create({
      data: {
        orderNumber,
        buyerId: buyer.id,
        addressId,
        status: "PENDING",
        subtotal: totals.subtotal,
        shippingCost: totals.shippingCost,
        taxAmount: totals.taxAmount,
        totalAmount: totals.totalAmount,
        requiresInvoice: request.requiresInvoice,
        rfc: request.requiresInvoice ? rfc : null,
        paymentMethod: "MERCADO_PAGO",
        items: {
          create: cart.items.map((item, index) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: lines[index].unitPrice,
          })),
        },
      },
      select: { id: true, orderNumber: true },
    });

    return {
      success: true as const,
      orderId: order.id,
      orderNumber: order.orderNumber,
    };
  });

  if (result.success) revalidatePath("/forma_de_pago");
  return result;
}
