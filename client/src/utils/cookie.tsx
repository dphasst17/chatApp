'use client'
import { token } from "@/api/auth"
import Cookies from "js-cookie"
const save = (key: string, value: string, exp: number) => {
    return Cookies.set(key, value, {
        expires: new Date(exp * 1000),
        path: "/",
    })
}

const get = (key: string) => {
    return Cookies.get(key)
}
const remove = (key: string) => {
    return Cookies.remove(key, {
        path: "/",
    })
}
const getToken = async () => {
    const access = get('c-atk')
    const refresh = get('c-rtk')
    if (!access) {
        if (!refresh) {
            remove('filmlogs')
            return false
        }
        const res = await token(refresh)
        save('c-atk', res.data.a, res.data.ea)
        return res.data.a
    }
    return access
}
export { save, get, remove, getToken }