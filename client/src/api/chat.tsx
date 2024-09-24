export const getChatList = async (token: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_PORT}/api/chat`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(res => res.json())
}
export const getChatDetail = async (id: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_PORT}/api/chat/${id}`)
        .then(res => res.json())
}
export const createChat = async (token: string, data: { [key: string]: string | number | boolean | [] | any }) => {
    return fetch(`${process.env.NEXT_PUBLIC_PORT}/api/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
        .then(res => res.json())
}
export const getChatById = async (id: string, page: number = 1, limit: number = 100) => {
    return fetch(`${process.env.NEXT_PUBLIC_PORT}/api/chat/${id}?page=${page}&limit=${limit}`)
        .then(res => res.json())
}
export const insertChat = async (token: string, id: string, data: { [key: string]: string | number | boolean | [] | any }) => {
    return fetch(`${process.env.NEXT_PUBLIC_PORT}/api/chat/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
        .then(res => res.json())
}
export const updateChat = async (token: string, id: string, data: { [key: string]: string | number | boolean | [] | any }) => {
    return fetch(`${process.env.NEXT_PUBLIC_PORT}/api/chat/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
        .then(res => res.json())
}
export const uploadImages = async (files: FormData) => {
    return fetch(`${process.env.NEXT_PUBLIC_PORT}/api/images/upload/chat`, {
        method: "POST",
        body: files
    })
        .then(res => res.json())
}
export const insertImages = async (token: string, id: string, data: { images: string[], name: string }) => {
    return fetch(`${process.env.NEXT_PUBLIC_PORT}/api/chat/images/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
        .then(res => res.json())
}