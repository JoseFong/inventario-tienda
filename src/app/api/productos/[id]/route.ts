import { deleteProduct, updateProduct } from "@/controllers/productController"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import prisma from "@/libs/prisma"

export async function DELETE(req:Request){
    try{
        const cookieStore = cookies()
        const cookie = cookieStore.get("storeUser")
        console.log(cookie)
        if(!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
        const decoded:any = jwt.verify(cookie.value,process.env.JWT_SECRET!)
    console.log("DELETE PRODUCTO\n"+JSON.stringify(decoded))
        if(decoded.type!=="admin" && decoded.type!=="superadmin") return NextResponse.json({message:"No está autorizado."},{status:400})

        const url = new URL(req.url)
        const id:any = url.pathname.split("/").pop()
        const idNum:number = parseInt(id)

        await deleteProduct(idNum)
            return NextResponse.json({status:200})
        }catch(e:any){
            return NextResponse.json({message:"Error 500: "+e.message},{status:500})
        }
}

export async function PATCH(req:Request){
    try{
        const cookieStore = cookies()
        const cookie = cookieStore.get("storeUser")
        if(!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
        const decoded:any = jwt.verify(cookie.value,process.env.JWT_SECRET!)
        if(decoded.type!=="admin" && decoded.type!=="superadmin") return NextResponse.json({message:"No está autorizado."},{status:400})
        
        const data = await req.json()
        
        const url = new URL(req.url)
        const id:any = url.pathname.split("/").pop()
        const idNum:number = parseInt(id)

        let product = await prisma.product.findFirst({
            where:{
                name: data.name
            }
        })
        if(product && product.id!==idNum) return NextResponse.json({message:"Ya existe un producto con ese nombre."},{status:400})
        
            product = await prisma.product.findFirst({
            where:{
                sku: data.sku
            }
        })
        if(product && product.id!==idNum) return NextResponse.json({message:"Ya existe un producto con ese SKU."},{status:400})
        
            await updateProduct(idNum,data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}