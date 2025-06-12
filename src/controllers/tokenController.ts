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

export async function getAllTokens(){
    return await prisma.token.findMany()
}

export async function deleteToken(id:number){
    await prisma.token.delete({
        where:{
            id:id
        }
    })
}

export async function getTokenByCode(code:string){
    return await prisma.token.findFirst({
        where:{
            value:code
        }
    })
}