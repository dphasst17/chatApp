'use client'
import { getChatImageById, getChatInfoById } from '@/api/chat'
import ChatDetail from '@/components/chat/chat'
import ChatInfoDetail from '@/components/chat/chat.info'
import { ChatInfo, VideoCall } from '@/components/icon/icon'
import { StateContext } from '@/context/state'
import { ChatByUser } from '@/interface/chat'
import { chatStore } from '@/stores/chat'
import { getToken } from '@/utils/cookie'
import socket from '@/utils/socket'
import { Avatar, Tooltip, } from '@nextui-org/react'
import React, { use, useEffect, useState } from 'react'

const ChatComponent = () => {
    const { chat, setChat, currentId } = use(StateContext)
    const { list, setList } = chatStore()
    const [dataImage, setDataImage] = useState<{ total: number, read: number, data: any[] }>({ total: 0, read: 0, data: [] })
    const [info, setInfo] = useState<any>()
    const [isInfo, setIsInfo] = useState<boolean>(false)
    useEffect(() => {
        const getData = async () => {
            const token = await getToken()
            getChatInfoById(chat._id)
                .then(res => {
                    res.status === 200 && setInfo(res.data)
                })
            token && getChatImageById(token, chat._id, 1, 20)
                .then(res => {
                    res.status === 200 && setDataImage({
                        total: res.data.total,
                        read: res.data.data.length,
                        data: res.data.data
                    })
                })
        }
        chat && chat._id !== currentId && getData()
        socket.on('s_g_r_chat_info', (data: { idChat: string, data: { [key: string]: string | number | boolean | [] | any[] | any } }) => {
            chat && chat._id === data.idChat && (
                setChat({
                    ...chat,
                    ...data.data
                }),
                setInfo({ ...info, ...data.data })
            )
            list && setList(list.map((c: ChatByUser) => c._id === data.idChat ? { ...c, ...data.data } : c))


        })
    }, [chat, currentId, list])
    const handleLoadMoreImage = async () => {
        const token = await getToken()
        const unread = dataImage.total - dataImage.read
        const nextPage = Math.ceil(dataImage.read / 20) + 1
        unread !== 0 && getChatImageById(token, chat._id, nextPage, 20)
            .then(res => {
                res.status === 200 && setDataImage({
                    total: dataImage.total,
                    read: dataImage.read + res.data.data.length,
                    data: [...dataImage.data, ...res.data.data]
                })
            })
    }
    return <div className='col-span-8 md:col-span-5 xl:col-span-6 h-[99vh] rounded-md text-red-500 overflow-x-hidden'>
        <div className='w-full h-full rounded-md flex flex-col justify-between'>
            <section className='w-full h-[8%] min-h-[80px] grid grid-cols-11 bg-zinc-950 bg-opacity-70 rounded-md' >
                {chat && <>
                    <div className='col-span-1 h-full flex items-center justify-center'>
                        <Avatar radius='sm' alt='avatar' src={chat.avatar} size='lg' />
                    </div>
                    <div className='col-span-9 flex items-center'>
                        <p className='text-xl font-bold'>{chat.name}</p>
                    </div>
                    <div className='col-span-1 h-full flex justify-around items-center'>
                        <VideoCall className='w-10 h-10' />
                        <Tooltip placement='left-start' offset={-30} crossOffset={100} content={

                            <ChatInfoDetail info={info} dataImage={dataImage} handleLoadMoreImage={handleLoadMoreImage} />
                        }>
                            <div className='w-10 h-10 '>
                                <ChatInfo className='w-10 h-10 cursor-pointer' onClick={() => setIsInfo(!isInfo)} />
                            </div>
                        </Tooltip>


                    </div>
                </>}
            </section>
            <ChatDetail />
        </div>
    </div >
}


export default ChatComponent