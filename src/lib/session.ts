import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey =
  process.env.SESSION_SECRET || "super-clave-secreta-dixema-2026";
const encodedKey = new TextEncoder().encode(secretKey);

export type SessionPayload = {
  userId: string;
  role: "BUYER" | "SELLER" | "ADMIN";
  email: string;
};

// Crear y guardar cookie de sesión
export async function createSession(payload: SessionPayload) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días de duración
  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

// Obtener y verificar la sesión actual
export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    const { payload } = await jwtVerify(sessionCookie, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    console.error("Sesión no válida:", error);
    return null;
  }
}

// Eliminar la sesión (Cerrar sesión)
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
