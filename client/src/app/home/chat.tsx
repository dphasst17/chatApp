'use client'
import { getChatImageById, getChatInfoById } from '@/api/chat'
import ChatDetail from '@/components/chat/chat'
import { ChatInfo, VideoCall } from '@/components/icon/icon'
import { StateContext } from '@/context/state'
import { Avatar, Button, Code, Tooltip, } from '@nextui-org/react'
import React, { use, useEffect, useState } from 'react'

const ChatComponent = () => {
    const { chat, currentId } = use(StateContext)
    const [dataImage, setDataImage] = useState<{ total: number, read: number, data: any[] }>({ total: 0, read: 0, data: [] })
    const [info, setInfo] = useState<any>()
    const [isInfo, setIsInfo] = useState<boolean>(false)
    useEffect(() => {
        chat && chat._id !== currentId && (
            getChatInfoById(chat._id)
                .then(res => {
                    res.status === 200 && setInfo(res.data)
                }),
            getChatImageById(chat._id, 1, 20)
                .then(res => {
                    res.status === 200 && setDataImage({
                        total: res.data.total,
                        read: res.data.data.length,
                        data: res.data.data
                    })
                })
        )
    }, [chat, currentId])
    const handleLoadMoreImage = () => {
        const unread = dataImage.total - dataImage.read
        const nextPage = Math.ceil(dataImage.read / 20) + 1
        unread !== 0 && getChatImageById(chat._id, nextPage, 20)
            .then(res => {
                res.status === 200 && setDataImage({
                    total: dataImage.total,
                    read: dataImage.read + res.data.data.length,
                    data: [...dataImage.data, ...res.data.data]
                })
            })
    }
    return <div className='col-span-6 h-[99vh] rounded-md text-red-500 overflow-x-hidden'>
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

const ChatInfoDetail = ({ info, dataImage, handleLoadMoreImage }:
    { info: any, dataImage: { total: number, read: number, data: any[] }, handleLoadMoreImage: () => void }
) => {
    const { chat } = use(StateContext)
    return chat && <section className='w-[400px] h-auto max-h-screen sm:max-h-[500px]rounded-md p-2'>
        <div className='title w-full flex flex-col justify-center items-center'>
            <Avatar isBordered radius='sm' alt='avatar' src={chat.avatar} size='lg' />
            <p className='text-center text-black text-xl font-bold mt-4 mb-2'>{chat.name}</p>
            {info.type === "individual" && <div className='memberList w-full h-auto grid grid-cols-3 gap-2 px-4'>
                <p className='col-span-3 text-black text-xl font-bold'>Member</p>
                {info.user.map((u: { idUser: string, name: string, avatar: string }) =>
                    <div key={`member-${u.idUser}`} className={`h-full flex flex-col justify-center items-center`}>
                        <Avatar key={u.idUser} isBordered radius='sm' alt='avatar' src={u.avatar} size='lg' />
                        <Code className='my-1 cursor-pointer'>{u.name}</Code>
                    </div>
                )}
            </div>}
            <div className='imgList w-full h-auto grid grid-cols-4 gap-2 px-4'>
                <p className='col-span-4 text-black text-xl font-bold'>Image</p>
                {dataImage.data.map((i: any) => <img key={i._id} src={i.image} className='w-20 h-20 rounded-md cursor-pointer object-cover' />)}
                {dataImage.total - dataImage.read > 0 && <Button className='w-full h-full rounded-md' onClick={handleLoadMoreImage}>Load more</Button>}
            </div>
        </div>
    </section>
}

export default ChatComponent