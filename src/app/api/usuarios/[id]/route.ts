import { deleteUser, updateUser, updateUserPassword } from "@/controllers/userController"
import prisma from "@/libs/prisma"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function PATCH(req:Request){
    try{
        const cookieStore = cookies()
                const cookie = cookieStore.get("storeUser")
                if(!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
                const decoded:any = jwt.verify(cookie.value,process.env.JWT_SECRET!)
                if(decoded.type!=="superadmin") return NextResponse.json({message:"No está autorizado."},{status:400})

        const url = new URL(req.url)
        const id:any = url.pathname.split("/").pop()
        const idNum:number = parseInt(id)

        const data = await req.json()

        const user = await prisma.user.findFirst({
            where: {
                username:data.username
            }
        })
        if(user && user.id!==idNum) return NextResponse.json({message:"Ya existe otro usuario con este nombre."},{status:400})

        await updateUser(idNum,data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}

export async function PUT(req:Request){
    try{
        const cookieStore = cookies()
                const cookie = cookieStore.get("storeUser")
                if(!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
                const decoded:any = jwt.verify(cookie.value,process.env.JWT_SECRET!)
                if(decoded.type!=="superadmin") return NextResponse.json({message:"No está autorizado."},{status:400})

        const url = new URL(req.url)
        const id:any = url.pathname.split("/").pop()
        const idNum:number = parseInt(id)

        const data = await req.json()

        await updateUserPassword(idNum,data.password)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}

export async function DELETE(req:Request){
    try{
        const cookieStore = cookies()
        const cookie = cookieStore.get("storeUser")
        if(!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
        const decoded:any = jwt.verify(cookie.value,process.env.JWT_SECRET!)
        if(decoded.type!=="superadmin") return NextResponse.json({message:"No está autorizado."},{status:400})
        const url = new URL(req.url)
        const id:any = url.pathname.split("/").pop()
        const idNum:number = parseInt(id)

        await deleteUser(idNum)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}