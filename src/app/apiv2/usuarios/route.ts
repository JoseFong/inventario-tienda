import { getUsers } from "@/controllers/userController"
import { NextResponse } from "next/server"

export async function GET(req:Request){
    try{
        
        const users = await getUsers()
        return NextResponse.json(users)
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}