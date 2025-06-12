import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"
import { deleteProvider, updateProvider } from "@/controllers/providerController"
import prisma from "@/libs/prisma"

export async function DELETE(req:Request){
    try{
        const cookieStore = cookies()
        const cookie = cookieStore.get("storeUser")
        if(!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
        const decoded:any = jwt.verify(cookie.value,process.env.JWT_SECRET!)
        if(decoded.type!=="superadmin" && decoded.type!=="admin") return NextResponse.json({message:"No está autorizado."},{status:400})

        const url = new URL(req.url)
        const id:any = url.pathname.split("/").pop()
        const idNum:number = parseInt(id)

        await deleteProvider(idNum)

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
        if(decoded.type!=="superadmin" && decoded.type!=="admin") return NextResponse.json({message:"No está autorizado."},{status:400})

            const data = await req.json()

         const url = new URL(req.url)
        const id:any = url.pathname.split("/").pop()
        const idNum:number = parseInt(id)

        let provider = await prisma.provider.findFirst({
            where:{
                name: data.name
            }
        })
        if(provider && provider.id!==idNum) return NextResponse.json({message:"Ya existe un proveedor con este nombre."},{status:400})

        provider = await prisma.provider.findFirst({
            where:{
                rfc:data.rfc
            }
        })
        if(provider && provider.id!==idNum) return NextResponse.json({message:"Ya existe un proveedor con este RFC."},{status:400})

        await updateProvider(idNum,data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}