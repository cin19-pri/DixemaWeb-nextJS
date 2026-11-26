import { redirect } from "next/navigation";
import DashboardClient, { type DashboardProduct } from "./dashboard-client";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "SELLER") {
    redirect("/login_proveedor");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      name: true,
      role: true,
      companyId: true,
      company: { select: { legalName: true } },
    },
  });

  if (!user || user.role !== "SELLER") {
    redirect("/login_proveedor");
  }

  const products: DashboardProduct[] = user.companyId
    ? await prisma.product.findMany({
        where: { companyId: user.companyId, isActive: true },
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
    <DashboardClient
      products={products}
      companyName={user.company?.legalName || user.name}
    />
  );
}
