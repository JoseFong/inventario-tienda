import { getTokenByCode } from "@/controllers/tokenController"
import { deleteUser } from "@/controllers/userController"
import { NextResponse } from "next/server"

export async function DELETE(req:Request){
    try{
        const headers = req.headers
        if(!headers.has("Authorization")) return NextResponse.json({message:"No está autorizado"},{status:400})
        const code = headers.get("Authorization")

        const token = await getTokenByCode(code+"")

        if(!token) return NextResponse.json({message:"Token de acceso incorrecto."},{status:400})
        if(token.entity!=="user") return NextResponse.json({message:"Token de acceso incorrecto."},{status:400})
        if(!token.permits.includes("DELETE")) return NextResponse.json({message:"Token de acceso incorrecto."},{status:400})

            const url = new URL(req.url)
            const id:any = url.pathname.split("/").pop()
            const idNum:number = parseInt(id)

        await deleteUser(idNum)
        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}