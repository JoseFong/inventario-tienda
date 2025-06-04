import prisma from "@/libs/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt  from "jsonwebtoken"

export async function POST(req:Request){
    try{
        const data = await req.json()

        const user = await prisma.user.findFirst({
            where:{
                username:data.username
            }
        })
        if(!user) return NextResponse.json({message:"Credencales incorrectas."},{status:400})

        const valid = await bcrypt.compare(data.password,user.password)

        if(!valid) return NextResponse.json({message:"Credencales incorrectas."},{status:400})

        const token = jwt.sign({username:user.username,type:user.type,id:user.id},process.env.JWT_SECRET!,{expiresIn:24*60*60})

        const cookieStore = await cookies()
        cookieStore.set({name:"storeUser",value:token,maxAge:24*60*60})

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}

export async function GET(req:Request){
    try{
        const cookieStore = await cookies()
        cookieStore.delete("storeUser")
        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}