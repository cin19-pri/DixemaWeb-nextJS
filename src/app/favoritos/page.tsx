import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import FavoritosClient from "./favoritos-client";

export default async function FavoritosPage() {
  const session = await getSession();
  if (!session || session.role !== "BUYER") {
    redirect("/login_usuario");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true },
  });

  if (!user || user.role !== "BUYER") {
    redirect("/login_usuario");
  }

  return <FavoritosClient />;
}
