//convert date to yy-mm-dd to dd/mm/yy
export const formatDate = (date: string) => {
    return date.split("T")[0].split("-").reverse().join("/")
}
export const convertDate = (date: string) => {
    return date.split("/").reverse().join("-")
}
export const handleFindData = async (data: any, res: any, resStatus: number) => {
    const findData = await data
    if (!findData) {

    }
    return { status: resStatus, data: findData }
}