import { createUser, getUsers } from "@/controllers/userController";
import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"

export async function GET(req: Request) {
  console.log("GET /api/users recibido");
  return NextResponse.json({ message: "GET sin validación funciona" });
}

export async function POST(req:Request){
    try{
        console.log("POST")
        const cookieStore = await cookies()
        const cookie = cookieStore.get("storeUser")
        if(!cookie) return NextResponse.json({message:"No esta autorizado para realizar esta acción."},{status:400})
        const decoded:any = jwt.verify(cookie.value,process.env.JWT_SECRET!)
        if(decoded.type!=="superadmin") return NextResponse.json({message:"No esta autorizado para realizar esta acción."},{status:300})

        const data = await req.json()
        const user = await prisma.user.findFirst({
            where: {
                username: data.username
            }
        })
        if(user) return NextResponse.json({message:"Ya existe un usuario con ese nombre."},{status:400})
        
        await createUser(data)
        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}

