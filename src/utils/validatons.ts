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
