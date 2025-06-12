import { Product } from "@/generated/prisma";
import prisma from "@/libs/prisma";
import { deleteProduct } from "./productController";

export async function getAllProviders(){
    return await prisma.provider.findMany()
}

export async function createProvider(data:any){
    await prisma.provider.create({
        data:{
            name: data.name,
            rfc:data.rfc
        }
    })
}

export async function deleteProvider(id:number){
    const products = await prisma.product.findMany({
        where:{
            providerId: id
        }
    })

    await Promise.all(products.map(async (p:Product)=>{
        await deleteProduct(p.id)
    }))

    await prisma.provider.delete({
        where: {
            id:id
        }
    })
}

export async function updateProvider(id:number,data:any){
    await prisma.provider.update({
        where: {
            id: id
        },
        data: {
            name: data.name,
            rfc: data.rfc
        }
    })
}