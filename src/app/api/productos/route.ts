import { createProduct, getAllProducts, getProductsFromProvider } from "@/controllers/productController";
import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"

export async function GET(req:Request){
    try{
        const cookieStore = cookies()
        const cookie = cookieStore.get("storeUser")
        if(!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
        const decoded:any = jwt.verify(cookie.value,process.env.JWT_SECRET!)
        if(decoded.type!=="admin" && decoded.type!=="superadmin") return NextResponse.json({message:"No está autorizado."},{status:400})

        const {searchParams} = new URL(req.url)
        const providerId = searchParams.get("providerId")

        if(providerId){
            const products = await getProductsFromProvider(parseInt(providerId))
            return NextResponse.json(products)
        }

        const products = await getAllProducts()
        return NextResponse.json(products)
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}

export async function POST(req:Request){
    try{
        console.log("aaa")
        const cookieStore = cookies()
        const cookie = cookieStore.get("storeUser")
        if(!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
        const decoded:any = jwt.verify(cookie.value,process.env.JWT_SECRET!)
    console.log(decoded)
        if(decoded.type!=="admin" && decoded.type!=="superadmin") return NextResponse.json({message:"No está autorizado."},{status:400})
        const data = await req.json()
        
        let product = await prisma.product.findFirst({
            where:{
                name: data.name
            }
        })
        if(product) return NextResponse.json({message:"Ya existe un producto con ese nombre."},{status:400})
        
            product = await prisma.product.findFirst({
            where:{
                sku: data.sku
            }
        })
        if(product) return NextResponse.json({message:"Ya existe un producto con ese SKU."},{status:400})
        
        await createProduct(data)
        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}