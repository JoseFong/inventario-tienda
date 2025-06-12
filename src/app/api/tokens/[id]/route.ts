import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"
import { deleteToken } from "@/controllers/tokenController"

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

            await deleteToken(idNum)
            return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}