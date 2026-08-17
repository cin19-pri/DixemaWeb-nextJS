import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey =
  process.env.SESSION_SECRET || "super-clave-secreta-dixema-2026";
const encodedKey = new TextEncoder().encode(secretKey);

// Define las rutas que quieres proteger
const protectedBuyerRoutes = ["/iniciousuarios", "/carrito", "/mis-compras"];
const protectedSellerRoutes = ["/gestion_producto", "/dashboard_proveedor"];
const authRoutes = [
  "/login_usuario",
  "/login_proveedor",
  "/registro_usuario",
  "/registro_proveedor",
];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get("session")?.value;

  // Verificar si hay una sesión válida
  let session = null;
  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie, encodedKey);
      session = payload as { userId: string; role: string; email: string };
    } catch (e) {
      // Si el token falló o expiró, dejamos session = null
    }
  }

  // Normalizamos el rol a mayúsculas para evitar problemas de tipeo
  const userRole = session?.role?.toUpperCase();
  const isSeller = userRole === "SELLER" || userRole === "VENDEDOR";
  const isBuyer = userRole === "BUYER" || userRole === "COMPRADOR";

  const isBuyerRoute = protectedBuyerRoutes.some((route) =>
    path.startsWith(route),
  );
  const isSellerRoute = protectedSellerRoutes.some((route) =>
    path.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  // 1. Si NO hay sesión y trata de entrar a ruta protegida -> Login
  if ((isBuyerRoute || isSellerRoute) && !session) {
    const redirectUrl = isSellerRoute ? "/login_proveedor" : "/login_usuario";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // 2. Si SI hay sesión e intenta entrar a Login/Registro -> Redirigir a su Panel
  if (isAuthRoute && session) {
    const destination = isSeller ? "/gestion_producto" : "/iniciousuarios";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 3. Control estricto de Roles entre vendedor y comprador
  if (isSellerRoute && !isSeller) {
    return NextResponse.redirect(new URL("/iniciousuarios", request.url));
  }

  if (isBuyerRoute && !isBuyer) {
    return NextResponse.redirect(new URL("/gestion_producto", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/iniciousuarios/:path*",
    "/gestion_producto/:path*",
    "/login_usuario",
    "/login_proveedor",
    "/registro_usuario",
    "/registro_proveedor",
  ],
};
