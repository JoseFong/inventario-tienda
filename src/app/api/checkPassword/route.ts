import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import prisma from "@/libs/prisma"
import bcrypt from "bcryptjs"

export async function POST(req:Request){
    try{
        const cookieStore = cookies()
        const cookie = cookieStore.get("storeUser")
        if(!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
        const decoded:any = jwt.verify(cookie.value,process.env.JWT_SECRET!)
        if(decoded.type!=="superadmin") return NextResponse.json({message:"No está autorizado."},{status:400})

        const data = await req.json()

        const user = await prisma.user.findFirst({
            where: {
                username: decoded.username
            }
        })
        
        if(!user) return NextResponse.json({message:"No está autorizado."},{status:400})
        const valid = await bcrypt.compare(data.password,user.password)

        if(!valid) return NextResponse.json({message:"No está autorizado."},{status:400})

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}