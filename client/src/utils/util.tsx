import { notiInsert } from "@/api/chat";
import { Notification } from "@/interface/chat";

export const formatDate = (date: Date) => {
    return date.toString().split("T")[0].split("-").reverse().join("/");
}
export const isToday = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date();
    const isDate = date.getDate() === today.getDate()
    const isMonth = date.getMonth() === today.getMonth()
    const isYear = date.getFullYear() === today.getFullYear()
    const dateSplit = date.toISOString().split("T")[0].split("-")
    if (isDate && isMonth && isYear) return "Today"
    if (isYear) return `${dateSplit[2]}/${dateSplit[1]}`
    else return date.toISOString().split("T")[0].split("-").reverse().join("/");
}
export const handleInsertNotification = async (token: string, idChat: string, noti: string, targetId?: string, watched?: string[]) => {
    const data: Notification = {
        idChat: idChat,
        targetId: targetId ?? "",
        notification: noti,
        date: new Date(),
        watched: watched ?? []
    }
    const result = await notiInsert(token, data)
    return result
}