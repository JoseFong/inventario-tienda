import prisma from "@/libs/prisma";

export async function getAllCustomers(){
    return await prisma.customer.findMany()
}

export async function createCustomer(data:any){
    await prisma.customer.create({
        data:{
            name: data.name,
            rfc: data.rfc,
            phone: data.phone,
            email: data.email,
            address: data.address
        }
    })
}

export async function getCustomerByName(name:string){
    return await prisma.customer.findFirst({
        where: {
            name: name
        }
    })
}

export async function getCustomerByRfc(rfc:string){
    return await prisma.customer.findFirst({
        where: {
            rfc: rfc
        }
    })
}

export async function updateCustomer(id:number,data:any){
    await prisma.customer.update({
        where:{
            id: id
        },
        data:{
            name: data.name,
            rfc: data.rfc,
            phone: data.phone,
            email: data.email,
            address: data.address
        }
    })
}

export async function deleteCustomer(id:number){
    await prisma.customer.delete({
        where: {id:id}
    })
}