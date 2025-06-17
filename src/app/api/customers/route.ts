import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"
import { createCustomer, getAllCustomers, getCustomerByName, getCustomerByRfc } from "@/controllers/customerController"
import prisma from "@/libs/prisma"

export async function GET(req:Request){
    try{
        const cookieStore = cookies()
        const cookie = cookieStore.get("storeUser")
        if(!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
        const decoded:any = jwt.verify(cookie.value,process.env.JWT_SECRET!)
        if(decoded.type!=="admin" && decoded.type!=="superadmin" && decoded.type!=="empleado") return NextResponse.json({message:"No está autorizado."},{status:400})

        const customers = await getAllCustomers()
        return NextResponse.json(customers)
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
        if(decoded.type!=="admin" && decoded.type!=="superadmin" && decoded.type!=="empleado") return NextResponse.json({message:"No está autorizado."},{status:400})
        
        const data = await req.json()
        
        let customer = await getCustomerByName(data.name)
        if(customer) return NextResponse.json({message:"Ya existe un cliente con este nombre."},{status:400})
        customer = await getCustomerByRfc(data.rfc)
        if(customer) return NextResponse.json({message:"Ya existe un cliente con este RFC."},{status:400})
        
        await createCustomer(data)
        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}