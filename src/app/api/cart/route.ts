import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: session.userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    return NextResponse.json(cart?.items || [], { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error al obtener el carrito" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { productId, quantity } = await request.json();
    let cart = await prisma.cart.findUnique({
      where: { userId: session.userId },
    });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: session.userId } });
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });

    return NextResponse.json(cartItem, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al agregar al carrito" },
      { status: 500 },
    );
  }
}
