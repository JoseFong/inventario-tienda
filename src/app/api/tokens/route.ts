import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"
import { createToken, getAllTokens } from "@/controllers/tokenController"

export async function POST(req:Request){
    try{
        const cookieStore = cookies()
        const cookie = cookieStore.get("storeUser")
        if(!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
        const decoded:any = jwt.verify(cookie.value,process.env.JWT_SECRET!)
        if(decoded.type!=="superadmin") return NextResponse.json({message:"No está autorizado."},{status:400})

        const data = await req.json()

        const token = await createToken(data)
        return NextResponse.json(token)
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}

export async function GET(req:Request){
    try{
        const cookieStore = cookies()
        const cookie = cookieStore.get("storeUser")
        if(!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
        const decoded:any = jwt.verify(cookie.value,process.env.JWT_SECRET!)
        if(decoded.type!=="superadmin") return NextResponse.json({message:"No está autorizado."},{status:400})

        const tokens = await getAllTokens()
        return NextResponse.json(tokens)
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}