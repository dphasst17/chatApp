export interface ChatDetailInfo {
    _id: string
    name: string,
    avatar: string,
}
export interface ChatByUser {
    _id: string
    user: string[]
    owner?: string
    type?: string
    lastMessage: string
    avatar: string
    name: string
    time?: Date
    created_at?: Date
    updated_at?: Date
    notification?: string
    userAction: { idUser: string, date: Date | string | null }[]
    deleteDate?: Date | string | null
}
export interface Chat {
    _id?: string
    idChat: string
    sender?: string
    name?: string
    avatar?: string
    message: string
    emoji: any
    date: string
    time: Date
    status: string
    replyId?: string
    replyContent?: string
    replyInfo?: string
}