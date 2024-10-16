export const login = async (username: string, password: string) => {
    return await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    })
        .then(res => res.json())
}
export const socialLogin = async (email: string, name: string, picture: string) => {
    return await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, picture }),
    })
        .then(res => res.json())
}
export const registerAuth = async (data: { username: string, password: string, name: string, email: string }) => {
    return await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then(res => res.json())
}
export const token = async (token: string) => {
    return await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/auth/token`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(res => res.json())
}
export const passwordUpdate = async (id: string, data: { current: string, password: string }) => {
    return await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/auth/password`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, data }),
    })
        .then(res => res.json())
}