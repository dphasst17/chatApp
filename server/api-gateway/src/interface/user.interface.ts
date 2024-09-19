export interface UserRequest {
    [key: string]: string | number
}
export interface FriendData {
    idFriend: string, status: string, created_at: Date, updated_at: Date
}
export interface FriendRequest {
    data: FriendData
    info: {
        name: string
        avatar: string
        online: boolean
    }
}
