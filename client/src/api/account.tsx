import { FriendRequest } from "@/interface/account"

export const getUser = async (token: string) => {
    return await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/user`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
}

export const updateUser = async (token: string, data: any) => {
    return await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/user/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ data }),
    })
        .then((res) => res.json())
}
export const searchUser = async (key: string) => {
    return await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/user/search/${key}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
}
export const getFriendByUser = async (token: string, status: "pending" | "accepted") => {
    return await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/user/friend/${status}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
}
export const addFriend = async (token: string, data: FriendRequest) => {
    return await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/user/friend`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
}

export const friendUpdate = async (data: { [key: string]: string | Date | number | any }) => {
    return await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/user/friend`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
}
export const friendRemove = async (id: string) => {
    return await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/user/friend/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
}