import { NextResponse } from "next/server";
import { agregarAlCarrito, obtenerCarrito } from "@/actions/cart";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

async function isBuyerAuthenticated() {
  const session = await getSession();
  if (!session || session.role !== "BUYER") return false;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true },
  });
  return user?.role === "BUYER";
}

export async function GET() {
  if (!(await isBuyerAuthenticated())) {
    return NextResponse.json({ error: "Debes iniciar sesión como comprador." }, { status: 401 });
  }

  return NextResponse.json(await obtenerCarrito(), { status: 200 });
}

export async function POST(request: Request) {
  if (!(await isBuyerAuthenticated())) {
    return NextResponse.json({ error: "Debes iniciar sesión como comprador." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "El cuerpo JSON no es válido." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("productId" in body) ||
    typeof body.productId !== "string" ||
    !("quantity" in body) ||
    typeof body.quantity !== "number"
  ) {
    return NextResponse.json(
      { error: "Se requiere productId y una cantidad válida." },
      { status: 400 },
    );
  }

  const result = await agregarAlCarrito(body.productId, body.quantity);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result, { status: 201 });
}
