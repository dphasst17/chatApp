import axiosInstance from "@/lib/axios"
const axios = axiosInstance
export const login = async (username: string, password: string) => {
    const data = { username, password }
    const result = await axios.post(`/api/auth/login`, { username, password })
    return result.data
}
export const socialLogin = async (email: string, name: string, picture: string) => {
    const data = { email, name, picture }
    const result = await axios.post(`/api/auth/login`, data)
    return result.data
}
export const registerAuth = async (data: { username: string, password: string, name: string, email: string }) => {
    const result = await axios.post(`/api/auth/register`, data)
    return result.data
}
export const token = async (token: string) => {
    const result = await axios.put(`/api/auth/token`, {}, {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })
    return result.data
}
export const passwordUpdate = async (id: string, dataUpdate: { current: string, password: string }) => {
    const data = { id, dataUpdate }
    const result = await axios.patch(`/api/auth/password`, data, {
        headers: {
            "Content-Type": "application/json",
        }
    })
    return result.data
}