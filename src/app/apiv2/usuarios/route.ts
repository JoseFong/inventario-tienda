import { getTokenByCode } from "@/controllers/tokenController"
import { createUser, getUsers } from "@/controllers/userController"
import prisma from "@/libs/prisma"
import { NextResponse } from "next/server"

export async function GET(req:Request){
    try{
        const headers = req.headers
        if(!headers.has("Authorization")) return NextResponse.json({message:"No está autorizado"},{status:400})
        const code = headers.get("Authorization")

        const token = await getTokenByCode(code+"")

        if(!token) return NextResponse.json({message:"Token de acceso incorrecto."},{status:400})
        if(token.entity!=="user") return NextResponse.json({message:"Token de acceso incorrecto."},{status:400})
        if(!token.permits.includes("READ")) return NextResponse.json({message:"Token de acceso incorrecto."},{status:400})

        const users = await getUsers()
        return NextResponse.json(users)
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}

export async function POST(req:Request){
    try{
        const headers = req.headers
        if(!headers) return NextResponse.json({message:"No esta autorizado."},{status:401})
        const code = headers.get("Authorization")
        if(!code) return NextResponse.json({message:"No esta autorizado."},{status:401})
        const token = await getTokenByCode(code)
        if(!token) return NextResponse.json({message:"No esta autorizado."},{status:402})
        if(token.entity!=="user") return NextResponse.json({message:"No esta autorizado."},{status:403})
        if(!token.permits.includes("CREATE")) return NextResponse.json({message:"No esta autorizado."},{status:405})
        
        const data = await req.json()
        
        const user = await prisma.user.findFirst({
            where:{
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