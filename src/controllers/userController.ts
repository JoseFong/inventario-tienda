import prisma from "@/libs/prisma";
import bcrypt from "bcryptjs"

export async function createUser(data:any){
    const hashed = await bcrypt.hash(data.password,10)

    return await prisma.user.create({
        data:{
            username: data.username,
            password: hashed,
            type: data.type
        }
    })
}

export async function getUsers(){
    return await prisma.user.findMany()
}

export async function updateUser(id:number,data:any){
    await prisma.user.update({
        where:{
            id:id
        },
        data: {
            username: data.username,
            type:data.type,
        }
    })
}

export async function updateUserPassword(id:number,password:string){
    const hashed = await bcrypt.hash(password,10)

    await prisma.user.update({
        where: {
            id: id
        },
        data:{
            password: hashed
        }
    })
}

export async function deleteUser(id:number){
    await prisma.user.delete({
        where:{
            id:id
        }
    })
}