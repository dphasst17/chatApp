import { Request } from "express"

export interface ResponseCustom {
    status: number,
    data?: ResponseData,
    message: string
}
export interface RequestCustom extends Request {
    idUser: string
}
export interface ResponseData {
    [key: string]: string | number | ObjectCustom[] | ObjectCustom
}
export interface ObjectCustom {
    [key: string]: string | number | {}[] | {}
}