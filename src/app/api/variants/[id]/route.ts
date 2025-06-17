import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { deleteVariation } from "@/controllers/variationController"

export async function DELETE(req:Request){
    try{
        const cookieStore = cookies()
        const cookie = cookieStore.get("storeUser")
        if(!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
        const decoded:any = jwt.verify(cookie.value,process.env.JWT_SECRET!)
        if(decoded.type!=="superadmin" && decoded.type!=="admin") return NextResponse.json({message:"No está autorizado."},{status:400})

        const url = new URL(req.url)
        const id:any = url.pathname.split("/").pop()
        const idNumber:number = parseInt(id)

        await deleteVariation(idNumber)
        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}