import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"
import { deleteCustomer, getCustomerByName, getCustomerByRfc, updateCustomer } from "@/controllers/customerController"

export async function PATCH(req:Request){
    try{
        const cookieStore = cookies()
        const cookie = cookieStore.get("storeUser")
        if(!cookie) return NextResponse.json({message:"No está autorizado."},{status:400})
        const decoded:any = jwt.verify(cookie.value,process.env.JWT_SECRET!)
        if(decoded.type!=="admin" && decoded.type!=="superadmin") return NextResponse.json({message:"No está autorizado."},{status:400})
        
        const url = new URL(req.url)
        const id:any = url.pathname.split("/").pop()
        const idNumber:number = parseInt(id)

        const data = await req.json()
        
        let customer = await getCustomerByName(data.name)
        if(customer && customer.id!==idNumber) return NextResponse.json({message:"Ya existe un cliente con este nombre."},{status:400})
        customer = await getCustomerByRfc(data.rfc)
        if(customer && customer.id!==idNumber) return NextResponse.json({message:"Ya existe un cliente con este RFC."},{status:400})

        await updateCustomer(idNumber,data)
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
        if(decoded.type!=="admin" && decoded.type!=="superadmin") return NextResponse.json({message:"No está autorizado."},{status:400})
        
        const url = new URL(req.url)
        const id:any = url.pathname.split("/").pop()
        const idNumber:number = parseInt(id)

        await deleteCustomer(idNumber)
        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}