'use client'
import { getChatImageById, getChatInfoById } from '@/api/chat'
import ChatDetail from '@/components/chat/chat'
import ChatInfoDetail from '@/components/chat/chat.info'
import { BackIcon, ChatInfo, VideoCall } from '@/components/icon/icon'
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
    return <div className={`fixed md:relative md:z-50 w-screen md:w-auto md:bg-transparent bg-white top-0 left-0 shadow-none md:shadow-2xl
        ${chat ? 'translate-x-0' : 'translate-x-[100%] md:translate-x-0'} 
        col-span-0 md:col-span-5 xl:col-span-6 h-screen md:h-[99vh] rounded-none md:rounded-md text-red-500 overflow-x-hidden transition-all`}>
        <div className='w-full h-full rounded-md flex flex-col justify-between p-1'>
            {chat ? <section className='w-full h-[14%] sm:h-[8%] min-h-[80px] flex flex-wrap justify-around items-center shadow-custom rounded-md' >
                <div className='w-2/5 sm:w-1/5 lg:w-[11%] xl:w-[5%] h-full flex items-center justify-around md:justify-start'>
                    <BackIcon className='w-10 h-10 block md:hidden cursor-pointer' onClick={() => setChat(null)} />
                    <Avatar radius='sm' alt='avatar' src={chat.avatar} size='lg' />
                </div>
                <div className='w-3/5 sm:w-3/4 lg:w-[88%] xl:w-[93%] h-full flex flex-wrap items-center justify-start'>
                    <div className='w-full sm:w-3/4 h-2/4 sm:h-full flex justify-start items-center text-xl font-bold'>
                        <span className='truncate text-zinc-950'>{chat.name}</span>
                    </div>
                    <div className='w-full sm:w-1/4 h-2/4 sm:h-full flex justify-start md:justify-end items-center'>
                        <VideoCall className='w-10 h-10 mx-1' />
                        <Tooltip placement='left-start' offset={-30} crossOffset={100} content={

                            <ChatInfoDetail info={info} dataImage={dataImage} handleLoadMoreImage={handleLoadMoreImage} />
                        }>
                            <div className='w-10 h-10 mx-1'>
                                <ChatInfo className='w-10 h-10 cursor-pointer' onClick={() => setIsInfo(!isInfo)} />
                            </div>
                        </Tooltip>
                    </div>
                </div>

            </section>
                : <section className='w-full h-[8%] min-h-[80px]'></section>
            }
            <ChatDetail info={info} />
        </div>
    </div >
}


export default ChatComponent