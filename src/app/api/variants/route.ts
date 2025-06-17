import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { createVariation, getAllVariations } from "@/controllers/variationController"
import prisma from "@/libs/prisma"

export async function GET(req:Request){
    try{
        const cookieStore = cookies()
        const cookie = cookieStore.get("storeUser")
        if(!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
        const decoded:any = jwt.verify(cookie.value,process.env.JWT_SECRET!)
        if(decoded.type!=="admin" && decoded.type!=="superadmin" && decoded.type!=="empleado") return NextResponse.json({message:"No está autorizado."},{status:400})

        const variations = await getAllVariations()
        return NextResponse.json(variations)
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}

export async function POST(req:Request){
    try{
        const cookieStore = cookies()
        const cookie = cookieStore.get("storeUser")
        if(!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
        const decoded:any = jwt.verify(cookie.value,process.env.JWT_SECRET!)
        if(decoded.type!=="admin" && decoded.type!=="superadmin") return NextResponse.json({message:"No está autorizado."},{status:400})

        const data = await req.json()

        let variant = await prisma.variation.findFirst({
            where:{
                name: data.variantName
            }
        })
        if(variant?.name===data.variantName) return NextResponse.json({message:"Ya existe un producto con este nombre."},{status:400})

            
        variant = await prisma.variation.findFirst({
            where:{
                sku: data.sku
            }
        })
        if(variant) return NextResponse.json({message:"Ya existe un producto con este SKU."},{status:400})

        await createVariation(data.productId,data)

        return NextResponse.json({status:200})
    }catch(e:any){
        console.log(e.message)
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}

