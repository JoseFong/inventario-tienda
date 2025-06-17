import prisma from "@/libs/prisma";
import { createVariation } from "./variationController";

export async function getAllProducts(){
    return await prisma.product.findMany()
}

export async function createProduct(data:any){
    const product = await prisma.product.create({
        data:{
            name:data.name,
            providerId: data.providerId,
            hasVariants: data.hasVariants
        }
    })

    await createVariation(product.id,data)
}

export async function deleteProduct(id:number){
    await prisma.variation.deleteMany({
        where:{
            productId:id
        }
    })

    await prisma.product.delete({
        where:{
            id:id
        }
    })
}

export async function updateProduct(id:number,data:any){
    await prisma.product.update({
        where:{
            id: id
        },
        data:{
            name:data.name,
            hasVariants:data.hasVariants,
            providerId: data.providerId
        }
    })
}

export async function getProductsFromProvider(id:number){
    return await prisma.product.findMany({
        where:{
            providerId: id
        }
    })
}