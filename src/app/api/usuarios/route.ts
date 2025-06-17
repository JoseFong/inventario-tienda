import { createUser, getUsers } from "@/controllers/userController";
import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"
import { User } from "@/generated/prisma";

export async function GET(req:Request){
    try{
        const cookieStore = cookies()
        const cookie = cookieStore.get("storeUser")
        if(!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
        const decoded:any = jwt.verify(cookie.value,process.env.JWT_SECRET!)
        if(decoded.type!=="superadmin") return NextResponse.json({message:"No está autorizado."},{status:400})

        const {searchParams} = new URL(req.url)
        const str = searchParams.get("usernameContains")

        if(str){
            const users = await getUsers()
            const usersFinal = users.filter((u:User)=>u.username.toLowerCase().includes(str.toLowerCase()))
            return NextResponse.json(usersFinal)
        }

        const users = await getUsers()
        return NextResponse.json(users)
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
        if(decoded.type!=="superadmin") return NextResponse.json({message:"No está autorizado."},{status:400})

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