import { redirect } from "next/navigation";
import GestionProductoClient, {
  type ProductoGestion,
} from "./gestion_producto-client";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function GestionProductoPage() {
  const session = await getSession();
  if (!session || session.role !== "SELLER") {
    redirect("/login_proveedor");
  }

  const usuario = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      name: true,
      email: true,
      phone: true,
      companyId: true,
      role: true,
    },
  });

  if (!usuario || usuario.role !== "SELLER") {
    redirect("/login_proveedor");
  }

  const productos: ProductoGestion[] = usuario.companyId
    ? await prisma.product.findMany({
        where: { companyId: usuario.companyId, isActive: true },
        select: {
          id: true,
          title: true,
          basePrice: true,
          stock: true,
          images: true,
          category: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <GestionProductoClient
      productos={productos}
      nombreUsuario={usuario.name}
      datoUsuario={usuario.phone || usuario.email}
    />
  );
}
