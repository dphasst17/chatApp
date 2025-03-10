import { notiInsert } from "@/api/chat";
import { Chat, Notification } from "@/interface/chat";
import { v4 as uuid } from "uuid";
import CryptoJS from "crypto-js";
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
export const renameImageFile = (file: File) => {
    const originalName = `${uuid()}.${file.name.split(".").pop()}`;
    const renameFile = new File([file], originalName, { type: file.type });
    return renameFile;
}
export const endCode = (data: string[] | string, key: string) => {
    const convertData = JSON.stringify(data);
    const code = CryptoJS.AES.encrypt(
        convertData,
        key,
    ).toString();
    const base64Encoded = CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(code),
    );
    return base64Encoded;
};
export const decode = (code: string, key: string) => {
    const decoded = CryptoJS.enc.Base64.parse(code).toString(CryptoJS.enc.Utf8);
    const result = CryptoJS.AES.decrypt(decoded, key);
    const stringData = result.toString(CryptoJS.enc.Utf8);
    return JSON.parse(stringData);
};

export const convertDataChat = (data: Chat[]) => {
    const listDate = Array.from(
        new Set(data.map((d: Chat) => d.date.split("T")[0])),
    )
    const result = listDate.map((d: any) => {
        return {
            date: d,
            data: data.filter((c: Chat) => c.date.split("T")[0] === d),
        };
    });
    return result;
}
export const extractImagesAndText = (content: string) => {
    const imgTag = content.match(/<img[^>]+>/g);
    if (!imgTag) return { text: content, images: [] };

    let remainingText = content;
    const images = imgTag.map((img) => {
        const src = img.match(/src="([^"]*)"/);
        remainingText = remainingText.replace(img, "");
        return src ? src[1] : null;
    }).filter(Boolean);

    return { text: remainingText, images };
};