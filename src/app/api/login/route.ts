import prisma from "@/libs/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"

export async function POST(req:Request){
    try{
        const data = await req.json()
        const user = await prisma.user.findFirst({
            where: {
                username: data.username
            }
        })
        if(!user) return NextResponse.json({message:"Credenciales incorrectas."},{status:400})
        const valid = await bcrypt.compare(data.password,user.password)
        if(!valid) return NextResponse.json({message:"Credenciales incorrectas."},{status:400})
        
        const token = jwt.sign({id:user.id,username:user.username,type:user.type},process.env.JWT_SECRET!,{expiresIn:"1d"})
        
        const response = NextResponse.json({message:"Inicio de sesión exitoso."})
        response.cookies.set("storeUser",token,{
            maxAge: 24*60*60,
            httpOnly: true,
            path: "/"
        })
        return response
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}

export async function GET(req:Request){
    try{
        const cookieStore = cookies()
        cookieStore.delete("storeUser")
        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}