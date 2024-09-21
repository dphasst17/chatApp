export interface ChatRequest {
    _id?: string
    sender: string
    message: string
    emoji: any
    date: Date
    time: Date
    status: string
}

export interface ChatInfoRequest {
    _id?: string
    name?: string
    avatar?: string
    user: string[]
    created_at: Date
    updated_at: Date
    time: Date
    type: string
    notification: string
}
export interface ChatImageRequest {
    idChat: string
    idUser: string
    image: string
    date: string
}
export interface ChatResponse {
    _id: string
    sender: string
    message: string
    emoji: any
    date: Date
    time: Date
    status: string
}

export interface ChatByUser {
    _id: string
    user: string[]
    type: string
    message: string
    avatar: string
    name: string
}