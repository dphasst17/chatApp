import { getChatById, insertChat, insertImages, updateChat, uploadImages } from '@/api/chat'
import { StateContext } from '@/context/state'
import React, { use, useEffect, useRef, useState } from 'react'
import { EmojiIcon, FileIcon, ImageIcon, MessageCircle, MessageUpload, ReactionIcon, TagMore } from '../icon/icon';
import EmptyChat from './emptyChat'
import { Button, Tooltip } from '@nextui-org/react'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { getToken } from '@/utils/cookie';
import { Chat, ChatByUser } from '@/interface/chat';
import Message from './message';
import { formatDate } from '@/utils/util';
import { accountStore } from '@/stores/account';
import socket from '@/utils/socket';
import { chatStore } from '@/stores/chat';
import { isToday } from '@/utils/util';
const ChatDetail = () => {
    const { chat, currentId, setCurrentId } = use(StateContext)
    const { account } = accountStore()
    const { list, setList } = chatStore()
    const [isPending, setIsPending] = useState<boolean>(false)
    const [data, setData] = useState<Chat[] | null>(null);
    const [count, setCount] = useState<{ total: number, totalPage: number, read: number }>({ total: 0, totalPage: 0, read: 0 })
    const [showPicker, setShowPicker] = useState(false);
    const [value, setValue] = useState<string>('')
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const handleFetchChat = async (firstFetch: boolean, data?: Chat[], page?: number, limit?: number) => {
        setIsPending(true)
        setData(null)
        const token = await getToken()
        getChatById(token, chat._id, page || 1, limit || 20)
            .then(res => {
                setIsPending(false)
                firstFetch && res.status === 200 && setData(res.data.data)
                !firstFetch && data && res.status === 200 && setData([...res.data.data, ...data])
                firstFetch && res.status === 200 && setCount({
                    total: res.data.total,
                    totalPage: Math.ceil(res.data.total / 5),
                    read: res.data.data.length,
                })
                res.status !== 200 && setData([])
                firstFetch && setCurrentId(chat._id)
            })
    }
    useEffect(() => {
        chat && chat._id !== currentId && handleFetchChat(true)
    }, [chat, currentId])
    useEffect(() => {
        scrollToBottom();
    }, [data])
    const onEmojiClick = (emojiData: EmojiClickData) => {
        setValue((prevInput) => prevInput + emojiData.emoji);
    };
    const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const arrFile = Array.from(e.target.files!)
        if (arrFile.length === 0) return
        const dataImages = new FormData()
        for (let i = 0; i < arrFile.length; i++) {
            dataImages.append('files', arrFile[i])
        }
        uploadImages(dataImages)
            .then(res => {
                if (res.status === 201) {
                    const dataMessage = {
                        message: `<div class="w-[530xp] h-auto flex flex-wrap justify-between">
                            ${arrFile.map((f: any) =>
                            `<img class="${arrFile.length >= 2 ? 'w-[49%] h-[150px] object-cover' : ''} ${arrFile.length === 1 ? 'w-full h-[300px] object-cover' : ''}" 
                            src="${process.env.NEXT_PUBLIC_S3}/chat/${f.name}" />`).join('')}
                        </div>` ,
                        date: new Date(),
                        time: new Date().toLocaleTimeString(),
                        emoji: [],
                        status: 'sent'
                    }
                    const insertData = async () => {
                        const token = await getToken()
                        account && token && insertImages(token, chat._id, {
                            images: arrFile.map((f: any) => `${process.env.NEXT_PUBLIC_S3}/chat/${f.name}`),
                            name: account.name
                        })
                            .then(res => {
                                if (res.status === 201) {
                                    console.log(res)
                                }
                            })
                        token && insertChat(token, chat._id, dataMessage)
                            .then(res => {
                                if (res.status === 201) {
                                    data && setData([...data, res.data])
                                    scrollToBottom()

                                    const currentChat = list && list.filter((c: ChatByUser) => c._id === chat._id)
                                    const newChat = list && list.filter((c: ChatByUser) => c._id !== chat._id)
                                    currentChat && newChat && setList([{
                                        ...currentChat[0],
                                        lastMessage: "Sent images"
                                    }, ...newChat])


                                }
                            })
                    }
                    insertData()
                }
            })
    }
    const handleSendMessage = async () => {
        if (!value) return
        const dataMessage = {
            message: `<p>${value}</p>`,
            date: new Date(),
            time: (new Date()).toTimeString().slice(0, 8),
            emoji: [],
            status: 'sent'
        }
        const token = await getToken()
        insertChat(token, chat._id, dataMessage)
            .then(res => {
                if (res.status === 201) {
                    data && setData([...data, res.data])
                    scrollToBottom()
                    const currentChat = list && list.filter((c: ChatByUser) => c._id === chat._id)
                    const newChat = list && list.filter((c: ChatByUser) => c._id !== chat._id)
                    currentChat && newChat && setList([{
                        ...currentChat[0],
                        lastMessage: dataMessage.message
                    }, ...newChat])
                    setValue('')
                }
            })
    }

    const handleScroll = async () => {
        if (chatContainerRef.current) {
            const { scrollTop } = chatContainerRef.current;

            if (scrollTop === 0) {
                const token = await getToken()
                const limit = 20
                const readPage = Math.ceil(count.read / limit)
                const unread = count.total - count.read
                unread !== 0 && data && getChatById(token, chat._id, readPage + 1, limit)
                    .then(res => {
                        data && res.status === 200 && setData([...res.data.data, ...data])
                        res.status === 200 && setCount({
                            total: count.total,
                            totalPage: count.totalPage,
                            read: count.read + res.data.data.length,
                        })
                    })
            }
        }
    };
    const handleReaction = async (emoji: EmojiClickData, id: string, arrayEmoji?: any[]) => {
        const dataUpdate = {
            type: "chat",
            emoji: emoji.emoji,
            detail: arrayEmoji,
        }
        const token = await getToken()
        updateChat(token, id, dataUpdate)
            .then(res => {
                if (res.status === 200) {

                    socket.emit('reaction', {
                        _id: id,
                        idChat: chat._id,
                        emoji: res.data
                    })
                }
            })
    }
    //this is function for socket
    useEffect(() => {
        socket.on('s_g_r_chat', (message: any) => {
            if (message.idChat !== chat._id) return
            data && setData([...data, message])
        })
        socket.on('s_g_r_reaction', (value: { _id: string, idChat: string, emoji: any[] }) => {
            if (chat && value.idChat !== chat._id) return
            data && setData(data.map((d: any) => {
                return d._id !== value._id ? d : {
                    ...d,
                    emoji: value.emoji
                }
            }))
        })
        return () => {
            socket.off('s_g_r_chat')
            socket.off('s_g_r_reaction')
        }
    }, [data, chat])
    return <section className='relative w-full h-[90%] rounded-md flex flex-col justify-between overflow-hidden'>
        <div ref={chatContainerRef} onScroll={handleScroll} className='message-content w-full h-[92%] max-h-[92%] py-2 bg-zinc-950 bg-opacity-70 rounded-md 
        overflow-y-auto overflow-x-hidden'>
            {isPending && <div className="my-auto text-zinc-300 flex-1 flex flex-col items-center justify-center p-1 text-center">Loading... </div>}
            {data && data.length === 0 && <div className="my-auto text-white flex-1 flex flex-col items-center justify-center p-6 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                    Start the conversation by sending your first message to Contact Name.
                </p>
            </div>}
            {
                account && data && data.length > 0 && data.map((c: Chat) => <div className={`relative w-full h-auto my-2 flex ${c.sender === account.idUser ? 'justify-end' : 'justify-start'}`} key={c._id}>
                    <div className='w-auto max-w-[70%] h-auto min-h-[20px]'>
                        <Message reverse={c.sender === account.idUser}
                            classContent={`w-full h-auto min-h-[20px] ${c.sender === account.idUser ? '' : ''} my-4`}
                            title={c.sender === account.idUser ? 'You' : c.name!} avatar={c.sender === account.idUser ? account.avatar : c.avatar!}
                            content={c.message}
                            time={`${formatDate(c.time)} - ${isToday(c.date!)}`}
                        />
                        {c.emoji.map((e: any) => e.idUser).filter((e: any) => e.includes(account.idUser)).length === 0 ? <>
                            <Tooltip
                                placement={c.sender === account.idUser ? 'top-end' : 'top-start'}
                                content={
                                    <EmojiPicker reactions={['2764-fe0f', '1f44d', '1f44e', '1f621', '1f604', '1f622', '1f44c', '1f44b']} reactionsDefaultOpen={true}
                                        onReactionClick={(e: EmojiClickData) => handleReaction(e, c._id as string, c.emoji)} />
                                }>
                                <div
                                    className={`block absolute -bottom-1 ${c.sender === account.idUser ? 'right-12' : 'left-12'} w-6 cursor-pointer rounded-md bg-zinc-500 transition-all`}>
                                    <ReactionIcon className="w-5 h-5 mx-auto" />
                                </div>
                            </Tooltip>
                            <div
                                className={`block absolute -bottom-2 ${c.sender === account.idUser ? 'right-20' : 'left-20'} 
                            w-6 flex justify-around items-center cursor-pointer rounded-md bg-zinc-500 transition-all`}>
                                {c.emoji.map((e: any) => e.emoji)}
                            </div>
                        </>
                            : <div
                                className={`block absolute -bottom-2 ${c.sender === account.idUser ? 'right-12' : 'left-12'} w-auto flex justify-around items-center cursor-pointer rounded-md bg-zinc-500 transition-all`}>
                                {new Set(c.emoji.map((e: any) => e.emoji))}
                            </div>
                        }


                    </div>

                </div>)
            }
            {!chat && <EmptyChat />}
            <div ref={messagesEndRef} />
        </div>
        {
            chat ? <div className='message-input w-full h-[8%] grid grid-cols-12 gap-x-5 pt-2'>
                <div className='col-span-4 xl:col-span-2 bg-zinc-950 bg-opacity-70 rounded-md flex justify-evenly items-center'>
                    <EmojiIcon onClick={() => setShowPicker(!showPicker)} className='w-7 h-7 cursor-pointer' />
                    {<label>
                        <ImageIcon className='w-7 h-7 cursor-pointer' />
                        <input multiple onChange={(e) => handleUploadImage(e)} type="file" accept='image/*' className='hidden' />
                    </label>}

                    <FileIcon className='w-6 h-6 cursor-pointer' />
                    <TagMore className='w-7 h-7 cursor-pointer' />
                </div>
                {showPicker && <EmojiPicker style={{ position: 'absolute', bottom: '60px', left: '0' }} onEmojiClick={onEmojiClick} />}
                <div className='col-span-6 xl:col-span-9'>
                    <input placeholder='Message...'
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        value={value} onChange={(e) => setValue(e.target.value)}
                        type="text" className='w-full h-full bg-zinc-900 bg-opacity-70 rounded-md text-white px-1 border border-solid border-zinc-400' />
                </div>
                <Button color='primary' className='col-span-2 xl:col-span-1 h-full rounded-md text-white px-1' onClick={handleSendMessage}>
                    <MessageUpload className='w-7 h-7 ' />
                </Button>
            </div>
                : <div className='message-input w-full h-[8%] bg-zinc-950 bg-opacity-70 rounded-md pt-2'></div>
        }
    </section>
}

export default ChatDetail