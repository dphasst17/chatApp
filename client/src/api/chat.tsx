import { Notification } from "@/interface/chat"
import axiosInstance from "@/lib/axios"
const axios = axiosInstance
export const getChatList = async (token: string) => {
    const result = await axios.get(`${process.env.NEXT_PUBLIC_PORT}/api/chat`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
    return result.data
}
export const createChat = async (token: string, data: { [key: string]: string | number | boolean | [] | any }) => {
    const result = await axios.post(`${process.env.NEXT_PUBLIC_PORT}/api/chat`, data, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
    return result.data
}
//insert notification
/* 
    data:{
        idChat: string,
        targetId: string
        notification: string,
        date: Date,
        watched: Array<string> || []
    }
*/
export const notiInsert = async (token: string, data: Notification) => {
    const result = await axios.post(`${process.env.NEXT_PUBLIC_PORT}/api/chat/notification`, data, {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })
    return result.data
}
//
export const leaveGroup = async (token: string, id: string) => {
    const result = await axios.put(`${process.env.NEXT_PUBLIC_PORT}/api/chat/leave/${id}`, {}, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
    return result.data
}
export const getNotiById = async (id: string, page?: number, limit?: number) => {
    const result = await axios.get(`${process.env.NEXT_PUBLIC_PORT}/api/chat/notification/${id}?page=${page ? page : 1}&limit=${limit ? limit : 20}`)
    return result.data

}
export const getChatInfoById = async (id: string) => {
    const result = await axios.get(`${process.env.NEXT_PUBLIC_PORT}/api/chat/info/${id}`)
    return result.data
}
export const getChatById = async (token: string, id: string, page?: number, limit?: number) => {
    const result = await axios.get(`${process.env.NEXT_PUBLIC_PORT}/api/chat/${id}?page=${page ? page : 1}&limit=${limit ? limit : 100}`,
        {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        }
    )
    return result.data
}
export const getChatImageById = async (token: string, id: string, page?: number, limit?: number) => {
    const result = await axios.get(`${process.env.NEXT_PUBLIC_PORT}/api/chat/image/${id}?page=${page ? page : 1}&limit=${limit ? limit : 20}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })
    return result.data
}
export const insertChat = async (token: string, id: string, data: { [key: string]: string | number | boolean | [] | any }) => {
    const result = await axios.post(`${process.env.NEXT_PUBLIC_PORT}/api/chat/message/${id}`, data, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
    return result.data
}
export const updateChat = async (token: string, id: string, data: { [key: string]: string | number | boolean | [] | any }) => {
    const result = await axios.patch(`${process.env.NEXT_PUBLIC_PORT}/api/chat/${id}`, data, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
    return result.data
}
export const uploadImages = async (files: FormData, folder?: string) => {
    const result = await axios.post(`${process.env.NEXT_PUBLIC_PORT}/api/images/upload/${folder ? folder : "chat"}`, files, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
    return result.data
}
export const insertImages = async (token: string, id: string, data: { images: string[], name: string }) => {
    const result = await axios.post(`${process.env.NEXT_PUBLIC_PORT}/api/chat/images/${id}`, data, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
    return result.data
}