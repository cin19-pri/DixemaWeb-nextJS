import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categoryNames = [
  "Aspiradora",
  "Audifonos",
  "Calcetines",
  "Cascos de Seguridad",
  "Correas para Perros",
  "Cuadernos",
  "Detergente",
  "Juguetes",
  "Martillos",
  "Paletas de Sombras",
  "Pulceras",
  "Sartenes",
  "Tiras Led",
  "Toallas",
  "Tuppers",
];

function createSlug(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  for (const name of categoryNames) {
    const slug = createSlug(name);
    await prisma.category.upsert({
      where: { name },
      update: { slug },
      create: { name, slug },
    });
  }
}

main()
  .catch((error: unknown) => {
    console.error("Error al crear las categorías:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
