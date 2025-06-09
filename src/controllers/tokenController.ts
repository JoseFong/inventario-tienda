import prisma from "@/libs/prisma";
import { generateRandomString } from "@/utils/validatons";

export async function createToken(data:any){
 const value = generateRandomString(20)
 
    return await prisma.token.create({
    data:{
        value: value,
        entity: data.entity,
        permits: data.permits
    }
 })   
}