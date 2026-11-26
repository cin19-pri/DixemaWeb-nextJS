-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "colores" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "medidas" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "modelos" TEXT[] DEFAULT ARRAY[]::TEXT[];
