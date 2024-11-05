import { FriendRequest } from "@/interface/account"
import axiosInstance from "@/lib/axios"
const axios = axiosInstance
export const getUser = async (token: string) => {
    const result = await axios.get(`${process.env.NEXT_PUBLIC_PORT}/api/user`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
    return result.data
}
export const updateUser = async (token: string, data: any) => {
    const result = await axios.patch(
        `${process.env.NEXT_PUBLIC_PORT}/api/user/`,
        data,
        {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        }
    );
    return result.data
}

export const searchUser = async (key: string) => {
    const result = await axios.get(`${process.env.NEXT_PUBLIC_PORT}/api/user/search/${key}`)
    return result.data
}
export const getFriendByUser = async (token: string, status: "pending" | "accepted") => {
    const result = await axios.get(`${process.env.NEXT_PUBLIC_PORT}/api/user/friend/${status}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
    return result.data
}
export const addFriend = async (token: string, data: FriendRequest) => {
    const result = await axios.post(`${process.env.NEXT_PUBLIC_PORT}/api/user/friend`, data, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
    return result.data
}

export const friendUpdate = async (data: { [key: string]: string | Date | number | any }) => {
    const result = await axios.patch(`${process.env.NEXT_PUBLIC_PORT}/api/user/friend`, data, {
        headers: {
        },
    })
    return result.data
}
export const friendRemove = async (id: string) => {
    const result = await axios.delete(`${process.env.NEXT_PUBLIC_PORT}/api/user/friend/${id}`)
    return result.data
}