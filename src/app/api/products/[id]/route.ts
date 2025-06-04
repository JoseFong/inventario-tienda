import { deleteProduct } from "@/controllers/productController"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function DELETE(req:Request){
    try{
        const cookieStore = await cookies()
                const cookie = cookieStore.get("storeUser")
                if(!cookie) return NextResponse.json({message:"No esta autorizado para realizar esta acción."},{status:300})
                const decoded:any = jwt.verify(cookie.value,process.env.JWT_SECRET!)
                if(decoded.type!=="superadmin" && decoded.type!=="admin") return NextResponse.json({message:"No esta autorizado para realizar esta acción."},{status:300})

        const url = new URL(req.url)
        const id:any = url.pathname.split("/").pop()
        const idNum:number = parseInt(id)

        await deleteProduct(idNum)
            return NextResponse.json({status:200})
        }catch(e:any){
            return NextResponse.json({message:"Error 500: "+e.message},{status:500})
        }
}