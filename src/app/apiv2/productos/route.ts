import { getAllProducts } from "@/controllers/productController";
import { NextResponse } from "next/server";

export async function GET(req:Request){
    try{
        const products = await getAllProducts()
        return NextResponse.json(products)
    }catch(e:any){
        return NextResponse.json({message:"Error 500: "+e.message},{status:500})
    }
}