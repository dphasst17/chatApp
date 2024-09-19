export interface Account {
    _id: string,
    idUser: string,
    name: string,
    email: string,
    phone: string,
    avatar: string,
    online: boolean
}
export interface Search {
    _id: string,
    idUser: string,
    name: string,
    avatar: string
}
export interface Friend {
    _id: string,
    idUser: string,
    idFriend: string,
    status: string,
    created_at: Date,
    updated_at: Date,
    friend: {
        avatar: string,
        name: string
        idUser: string,
        online: boolean
    }
}
export interface FriendRequestData {
    idUser?: string,
    idFriend: string,
    status: string,
    created_at: Date,
    updated_at: Date
}
export interface FriendRequest {
    data: FriendRequestData
    info: {
        name: string
        avatar: string
        online: boolean
    }
}
