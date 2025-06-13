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
            pictureUrl:data.pictureUrl,
            providerId: data.providerId
        }
    })
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
            sku:data.sku,
            name:data.name,
            price:data.price,
            hasVariants:data.hasVariants,
            stock:data.stock,
            pictureUrl:data.pictureUrl,
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