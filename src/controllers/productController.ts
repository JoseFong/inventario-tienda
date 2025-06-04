import prisma from "@/libs/prisma";

export async function getAllProducts(){
    return await prisma.product.findMany()
}

export async function createProduct(data:any){
    return await prisma.product.create({
        data:{
            sku:data.sku,
            name:data.name,
            price:data.price,
            hasVariants:data.hasVariants,
            stock:data.stock,
            pictureUrl:data.pictureUrl
        }
    })
}

export async function deleteProduct(id:number){
    await prisma.product.delete({
        where:{
            id:id
        }
    })
}