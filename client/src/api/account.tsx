export const getUser = async (token: string) => {
    return await fetch("http://localhost:3000/api/user", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
}

export const updateUser = async (token: string, data: any) => {
    return await fetch("http://localhost:3000/api/user/", {
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
    return await fetch(`http://localhost:3000/api/user/search/${key}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
}
export const getFriendByUser = async (token: string, status: "pending" | "accepted") => {
    return await fetch(`http://localhost:3000/api/user/friend/${status}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
}
export const addFriend = async (idFriend: string, status: string, created_at: Date, updated_at: Date, token: string) => {
    return await fetch(`http://localhost:3000/api/user/friend`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ idFriend, status, created_at, updated_at }),
    })
        .then((res) => res.json())
}
export const friendRemove = async (id: string, token: string) => {
    return await fetch(`http://localhost:3000/api/user/friend/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
}