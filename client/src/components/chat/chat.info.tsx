import { leaveGroup, updateChat, uploadImages } from "@/api/chat"
import { StateContext } from "@/context/state"
import { accountStore } from "@/stores/account"
import { getToken } from "@/utils/cookie"
import React, { use, useState } from "react"
import { EditIcon, EditImageIcon } from "../icon/icon"
import { Avatar, Badge, Button, Code, Input, Modal, useDisclosure } from "@nextui-org/react"
import { ChatInfoUser, Friend } from "@/interface/account"
import socket from "@/utils/socket"
import ConfirmModal from "../modal/confirm.modal"
import { chatStore } from "@/stores/chat"
import { ChatByUser } from "@/interface/chat"

const ChatInfoDetail = ({ info, dataImage, handleLoadMoreImage }:
    { info: any, dataImage: { total: number, read: number, data: any[] }, handleLoadMoreImage: () => void }
) => {
    const { chat, setChat } = use(StateContext)
    const { account, friend } = accountStore()
    const { list, setList } = chatStore()
    const [edit, setEdit] = useState("")
    const [modal, setModal] = useState("")
    const [addMember, setAddMember] = useState<boolean>(false)
    const [data, setData] = useState<{ [key: string]: string | File[] | any }>()
    const [handle, setHandle] = useState<any>(null)
    const [parameter, setParameter] = useState<any>(null)
    const [contentBtn, setContentBtn] = useState<string>('')
    const { isOpen, onOpenChange, onClose, onOpen } = useDisclosure()
    const handleChange = async () => {
        if (!data) {
            setEdit("")
            return
        }
        const convertData = data.avatar ? {
            avatar: data.avatar ? `${process.env.NEXT_PUBLIC_S3}/user/${data.avatar[0].name}` : ""
        } : data
        const images = new FormData()
        data.avatar && data.avatar.forEach((f: File) => images.append('files', f))
        const token = await getToken()
        const _id = chat?._id
        data.avatar && uploadImages(images, 'user')
            .then(res => {
                console.log(res)
            })
        token && updateChat(token, _id, convertData)
            .then(res => {
                if (res.status === 200) {
                    socket.emit('chat_info', {
                        idChat: _id,
                        data: convertData
                    })
                    setEdit("")
                }
            })
    }
    const handleChangeMember = async (data: { type: "add" | "remove", id: string, userList: string[], name?: string, avatar?: string }) => {
        const type = data.type
        const id = data.id
        const userList = data.userList
        const name = data.name
        const avatar = data.avatar
        const userListData = type === "add" ? [...userList, id] : userList.filter((u: string) => u !== id)
        const incluseUserAction = info.userAction.filter((u: any) => u.idUser === id)
        const dataUpdate = incluseUserAction.length > 0 ? {
            user: userListData
        } : {
            user: userListData,
            userAction: [...info.userAction, {
                idUser: id,
                date: new Date()
            }]
        }
        const token = await getToken()
        const _id = chat?._id
        token && updateChat(token, _id, dataUpdate)
            .then(res => {
                if (res.status === 200) {
                    socket.emit('chat_info', {
                        idChat: _id,
                        data: {
                            user: type === "add" ? [...info.user, {
                                idUser: id,
                                name: name,
                                avatar: avatar
                            }] : userListData
                        }
                    })

                }
                else {
                    console.log(res.message)
                }
                setModal("")
                setHandle(null)
                onClose()
            })
    }
    const handleUpdateOwner = async (data: { idUser: string }) => {
        const { idUser } = data
        const token = await getToken()
        const _id = chat?._id
        token && updateChat(token, _id, { owner: idUser })
            .then(res => {
                if (res.status === 200) {
                    socket.emit('chat_info', {
                        idChat: _id,
                        data: {
                            owner: idUser
                        }
                    })
                }
                else {
                    console.log(res.message)
                }
                setModal("")
                setHandle(null)
                onClose()
            })
    }
    const handleLeaveChat = async () => {
        const token = await getToken()
        const _id = chat?._id
        token && leaveGroup(token, _id)
            .then(res => {
                if (res.status === 200) {
                    list && setList(list.filter((c: ChatByUser) => c._id !== _id))
                    setChat(null)
                }
                else {
                    console.log(res.message)
                }
                setModal("")
                setHandle(null)
                onClose()
            })
    }
    return chat && <section className='w-[400px] h-auto max-h-screen sm:max-h-[500px]rounded-md p-2'>
        <div className='title w-full flex flex-col justify-center items-center'>
            <div className='avatar w-full h-auto flex justify-center items-center'>
                {((edit === "" || edit !== "avatar") && (info.owner === account?.idUser)) && <Badge classNames={{ badge: 'rounded-md !ml-12' }}
                    content={<label>
                        <EditImageIcon className='w-6 h-6 cursor-pointer' />
                        <input type="file" className="hidden" onChange={(e) => {
                            setData({ avatar: Array.from(e.target.files!) })
                            setEdit("avatar")
                        }} />
                    </label>
                    }
                    shape='rectangle' placement='bottom-right'>
                    <Avatar isBordered radius='sm' alt='avatar' src={chat.avatar} size='lg' />
                </Badge>
                }
                {edit === "avatar" && <div className="w-full h-auto flex flex-wrap justify-center items-center">
                    <div className="w-full flex justify-center items-center my-1">
                        <Avatar isBordered radius='sm' alt='avatar' src={data && data.avatar ? URL.createObjectURL(data.avatar[0]) : chat.avatar} size='lg' />
                    </div>
                    <Button size="sm" color="primary" className="m-1" onClick={handleChange}>Save</Button>
                    <Button size="sm" color="danger" className="m-1" onClick={() => setEdit("")}>Cancel</Button>
                </div>}
            </div>
            <div className='w-full h-auto flex justify-evenly items-center mt-4 mb-2'>
                {account && (edit === "" || edit !== "info") && <p className='flex items-center text-center text-black text-xl font-bold'>
                    {chat.name}{info.owner === account?.idUser && <EditIcon onClick={() => setEdit("info")} className='w-5 h-5 ml-2 cursor-pointer' />}
                </p>}

                {account && edit === "info" && <>
                    <Input size='sm' className='w-2/4' placeholder='Name' defaultValue={chat.name} onChange={(e) => setData({ name: e.target.value })} />
                    <Button size="sm" color="primary" onClick={handleChange}>Save</Button>
                    <Button size="sm" color="danger" onClick={() => setEdit("")}>Cancel</Button>
                </>}
            </div>

            {/* Member */}
            {info.type === "group" && <div className='memberList w-full h-auto grid grid-cols-3 gap-2 px-4'>
                {info.owner === account?.idUser && <Button className="" size="sm" color="primary" onClick={() => setAddMember(true)}>Add member</Button>}
                <p className='col-span-3 text-black text-xl font-bold'>Member</p>
                {info.user.map((u: { idUser: string, name: string, avatar: string }) =>
                    <div key={`member-${u.idUser}`} className={`h-full flex flex-col justify-center items-center`}>
                        <Avatar key={u.idUser} isBordered radius='sm' alt='avatar' src={u.avatar} size='lg' />
                        <Code className='my-1 cursor-pointer'>{u.name}</Code>
                        {(info.owner === account?.idUser && info.owner !== u.idUser) ? <Button size="sm" color="primary"
                            className="h-[20px]"
                            onClick={() => {
                                setModal("confirm")
                                setHandle("updateOwner")
                                setParameter({ idUser: u.idUser })
                                setContentBtn("Set as owner")
                                onOpen()

                            }}
                        >
                            Set as owner
                        </Button>
                            : <div className="h-[20px]"></div>
                        }
                    </div>
                )}
                {addMember && <div className="col-span-3 w-full h-auto grid grid-cols-3 gap-2">
                    {friend && friend.map((f: Friend) => <div key={f._id} className="w-full flex flex-wrap justify-around items-center">
                        <div className="w-full flex justify-center items-center">
                            <Avatar isBordered radius='sm' alt='avatar' src={f.friend.avatar} size='lg' />
                        </div>
                        <p className='my-1 cursor-pointer'>{f.friend.name}</p>
                        {info.user.filter((u: ChatInfoUser) =>
                            u.idUser === f.friend.idUser
                        ).length !== 0 ?
                            <Button
                                onClick={() => {
                                    setModal("delete")
                                    setHandle("updateMember")
                                    setParameter({ type: "remove", id: f.friend.idUser, userList: info.user.map((u: ChatInfoUser) => u.idUser) })
                                    setContentBtn("Remove")
                                    onOpen()
                                }}
                                isIconOnly key={f._id} size="sm"
                                color="danger" className="w-5 h-5 rounded-md">
                                x
                            </Button>
                            :
                            <Button
                                onClick={() => handleChangeMember({
                                    type: "add", id: f.friend.idUser, userList: info.user.map((u: ChatInfoUser) => u.idUser), name: f.friend.name, avatar: f.friend.avatar
                                })}
                                isIconOnly key={f._id} size="sm"
                                color="primary" className="w-5 h-5 rounded-md">
                                +
                            </Button>}
                    </div>)}
                </div>}
            </div>}

            {/* Image */}
            <div className='imgList w-full h-auto grid grid-cols-4 gap-2 px-4'>
                <p className='col-span-4 text-black text-xl font-bold'>Image</p>
                {dataImage.data.map((i: any) => <img key={i._id} src={i.image} className='w-20 h-20 rounded-md cursor-pointer object-cover' />)}
                {dataImage.total - dataImage.read > 0 && <Button className='w-full h-full rounded-md' onClick={handleLoadMoreImage}>Load more</Button>}
            </div>
            {
                info.type === "group" && <div className="w-full h-[100px] flex items-center justify-center">
                    <Button color="danger" radius="sm" onClick={() => { setModal("delete"), setHandle("leaveGroup"), setContentBtn("Leave"), onOpen() }}>Leave a group</Button>
                </div>
            }
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
            <ConfirmModal type={modal} onClose={onClose} handle={() =>
                handle === "updateOwner" ? handleUpdateOwner(parameter)
                    : (
                        handle === "updateMember" ? handleChangeMember(parameter) : handleLeaveChat()
                    )
            }
                contentBtn={contentBtn} />
        </Modal>
    </section >
}
export default ChatInfoDetail