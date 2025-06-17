import prisma from "@/libs/prisma";

export async function createVariation(productId: number, data: any) {
  await prisma.variation.create({
    data: {
      productId: productId,
      sku: data.sku,
      name: data.variantName,
      price: data.price,
      stock: data.stock,
      pictureUrl: data.pictureUrl,
    },
  });
}

export async function getAllVariations() {
  return await prisma.variation.findMany();
}

export async function deleteVariation(id:number){
  await prisma.variation.delete({
    where: {
      id:id
    }
  })
}