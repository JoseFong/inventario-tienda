import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"
import { createProvider, getAllProviders } from "@/controllers/providerController"
import prisma from "@/libs/prisma"

export async function GET(req:Request){
    try{
        const cookieStore = cookies()
        const cookie = cookieStore.get("storeUser")
        if(!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
        const decoded:any = jwt.verify(cookie.value,process.env.JWT_SECRET!)
        if(decoded.type!=="superadmin" && decoded.type!=="admin") return NextResponse.json({message:"No está autorizado."},{status:400})

            const providers = await getAllProviders()
        return NextResponse.json(providers)
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
        if(decoded.type!=="superadmin" && decoded.type!=="admin") return NextResponse.json({message:"No está autorizado."},{status:400})

            const data = await req.json()

        let provider = await prisma.provider.findFirst({
            where:{
                name: data.name
            }
        })
        if(provider) return NextResponse.json({message:"Ya existe un proveedor con este nombre."},{status:400})

        provider = await prisma.provider.findFirst({
            where:{
                rfc:data.rfc
            }
        })
        if(provider) return NextResponse.json({message:"Ya existe un proveedor con este RFC."},{status:400})

            await createProvider(data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}

