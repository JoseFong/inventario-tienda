import { Product } from "@/generated/prisma"

export function isEmpty(str:string){
    if(str==="") return true
    return false
}

export function validPassword(str:string){
    if(str.length<8) return false
    if(!/\d/.test(str)) return false
    if(!/[a-z]/.test(str)) return false
    if(!/[A-Z]/.test(str)) return false
    return true
}

export function validTimes(start:string,end:string){
    if(start==="" || end==="") return false
    const startInt:number = parseInt(start.replace(":",""))
    const endInt:number = parseInt(end.replace(":",""))
    if(startInt>=endInt) return false
    return true
}

export function validName(str:string){
    if(/^[a-zA-Z0-9 ]+$/.test(str)) return true
    return false
}

type Day = {
    name:string,
    active: boolean,
    start:string,
    end:string
}


export function generateRandomString(longitud: number): string {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let resultado = '';

  for (let i = 0; i < longitud; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    resultado += caracteres.charAt(indice);
  }

  return resultado;
}

export function validMail(str:string){
    if(!str.includes("@")) return false
    if(!str.includes(".")) return false
    if(str.charAt(str.length-1)===".") return false
    if(str.charAt(str.length-1)==="@") return false
    return true
}

export type ProductQuantity = {
        id: number,
        quant: number
        price: number,
    }