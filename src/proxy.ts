import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error(
    "SESSION_SECRET is required. Set it in your environment before starting the app.",
  );
}
const encodedKey = new TextEncoder().encode(secretKey);

type UserRole = "BUYER" | "SELLER" | "ADMIN";
type Session = { userId: string; role: UserRole; email: string };

const protectedBuyerRoutes = [
  "/carrito",
  "/favoritos",
  "/forma_de_pago",
  "/notificaciones",
  "/perfilusuario",
  "/iniciousuarios",
  "/categorias",
  "/mis-compras",
];
const protectedSellerRoutes = [
  "/nuevo_producto",
  "/gestion_producto",
  "/dashboard",
  "/notificacionesprovedor",
  "/profile_proveedor",
  "/dashboard_proveedor",
];
const authenticatedRoutes = ["/chat"];
const authRoutes = [
  "/login_usuario",
  "/login_proveedor",
  "/registro_usuario",
  "/registro_proveedor",
];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get("session")?.value;

  let session: Session | null = null;
  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie, encodedKey);
      const role = payload.role;
      if (
        typeof payload.userId === "string" &&
        typeof payload.email === "string" &&
        (role === "BUYER" || role === "SELLER" || role === "ADMIN")
      ) {
        session = { userId: payload.userId, email: payload.email, role };
      }
    } catch {
      // An invalid or expired token is treated as an unauthenticated request.
    }
  }

  const matchesRoute = (routes: string[]) =>
    routes.some((route) => path === route || path.startsWith(`${route}/`));
  const isBuyerRoute = matchesRoute(protectedBuyerRoutes);
  const isSellerRoute = matchesRoute(protectedSellerRoutes);
  const isAuthenticatedRoute = matchesRoute(authenticatedRoutes);
  const isAuthRoute = matchesRoute(authRoutes);

  if ((isBuyerRoute || isSellerRoute || isAuthenticatedRoute) && !session) {
    const redirectUrl = isSellerRoute
      ? "/login_proveedor"
      : "/login_usuario";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  if (isAuthRoute && session) {
    const destination =
      session.role === "SELLER" ? "/gestion_producto" : "/iniciousuarios";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (isSellerRoute && session?.role !== "SELLER") {
    if (session?.role === "BUYER") {
      return NextResponse.redirect(new URL("/iniciousuarios", request.url));
    }
    return NextResponse.json({ error: "Acceso no autorizado" }, { status: 403 });
  }

  if (isBuyerRoute && session?.role !== "BUYER") {
    if (session?.role === "SELLER") {
      return NextResponse.redirect(new URL("/gestion_producto", request.url));
    }
    return NextResponse.json({ error: "Acceso no autorizado" }, { status: 403 });
  }

  if (isAuthenticatedRoute && session?.role === "ADMIN") {
    return NextResponse.json({ error: "Acceso no autorizado" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/carrito/:path*",
    "/favoritos/:path*",
    "/forma_de_pago/:path*",
    "/notificaciones/:path*",
    "/perfilusuario/:path*",
    "/iniciousuarios/:path*",
    "/categorias/:path*",
    "/mis-compras/:path*",
    "/nuevo_producto/:path*",
    "/gestion_producto/:path*",
    "/dashboard/:path*",
    "/notificacionesprovedor/:path*",
    "/profile_proveedor/:path*",
    "/dashboard_proveedor/:path*",
    "/chat/:path*",
    "/login_usuario",
    "/login_proveedor",
    "/registro_usuario",
    "/registro_proveedor",
  ],
};
