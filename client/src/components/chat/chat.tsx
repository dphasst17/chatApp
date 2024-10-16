import { CloseIcon, EmojiIcon, FileIcon, ImageIcon, MessageCircle, MessageUpload, ReactionIcon, TagMore } from '../icon/icon';
import { getChatById, insertChat, insertImages, updateChat, uploadImages } from '@/api/chat';
import React, { use, useEffect, useRef, useState } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Button, Input, Tooltip } from '@nextui-org/react';
import { Chat, ChatByUser } from '@/interface/chat';
import Message, { MessageReplyUI } from './message';
import { StateContext } from '@/context/state';
import { accountStore } from '@/stores/account';
import { getToken } from '@/utils/cookie';
import { formatDate } from '@/utils/util';
import { chatStore } from '@/stores/chat';
import { isToday } from '@/utils/util';
import { toast } from 'react-toastify';
import socket from '@/utils/socket';
import EmptyChat from './emptyChat';
const ChatDetail = ({ info }: { info: any }) => {
    const { chat, currentId, setCurrentId } = use(StateContext)
    const { account } = accountStore()
    const { list, setList } = chatStore()
    const [isPending, setIsPending] = useState<boolean>(false)
    const [data, setData] = useState<Chat[] | null>(null);
    const [reply, setReply] = useState<{ id: string, name: string, content: string, time: any } | null>(null)
    const [count, setCount] = useState<{ total: number, totalPage: number, read: number }>({ total: 0, totalPage: 0, read: 0 })
    const [showPicker, setShowPicker] = useState(false);
    const [value, setValue] = useState<string>('')
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const handleFetchChat = async (firstFetch: boolean, data?: Chat[], page?: number, limit?: number) => {
        setReply(null)
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
        scrollToBottom()
    }, [chat, currentId])
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
            replyId: reply ? reply.id : '',
            replyContent: reply ? reply.content : '',
            replyInfo: reply ? `${reply.name} - ${reply.time}` : '',
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
                    setReply(null)
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
    const handleScrollReply = async (id: string) => {
        const scrollToMessage = () => {
            const messageElement = document.getElementById(id);
            if (messageElement) {
                chatContainerRef.current?.scrollTo({
                    top: messageElement.offsetTop,
                    behavior: 'smooth',
                });
            }
        }
        const includeCurrentChat = data && data.filter((d: Chat) => d._id === id)
        if (includeCurrentChat && includeCurrentChat.length === 0) {
            let isInclude = false; // Dùng để theo dõi xem dữ liệu có hợp lệ không
            const arrayData: any[] = [];
            const token = await getToken();
            const limit = 20;
            const readPage = Math.ceil(count.read / limit);
            let currentPage = readPage + 1;
            while (true) {
                try {
                    const response = await getChatById(token, chat._id, currentPage, limit);
                    if (response.status === 200) {
                        const { data: resData } = response.data;
                        arrayData.push(...resData);

                        // Kiểm tra nếu tìm thấy chat hiện tại
                        const includeCurrentChat = resData.some((d: Chat) => d._id === id);
                        if (includeCurrentChat) {
                            isInclude = true; // Đánh dấu dữ liệu hợp lệ
                            break; // Thoát khỏi vòng lặp
                        }
                    } else {
                        break; // Nếu status không phải 200, thoát vòng lặp
                    }
                } catch (error) {
                    console.error("Error fetching chat data:", error);
                    break; // Thoát vòng lặp nếu có lỗi khi gọi API
                }

                currentPage++; // Tăng số trang để tiếp tục tìm
            }
            if (!isInclude) {
                toast.error("Can't find chat")
                return
            }
            data && setData([...arrayData, ...data])
        }
        setTimeout(() => {
            scrollToMessage();
        }, 100);
    }
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
    return <section className='relative w-full h-[85%] sm:h-[91%] rounded-md flex flex-col justify-between overflow-hidden'>
        <div ref={chatContainerRef} onScroll={handleScroll} className={`message-content w-full ${!reply ? 'h-[92%]' : 'h-[85%]'} max-h-[92%] py-2 rounded-md 
        overflow-y-auto overflow-x-hidden transition-all`}>
            {isPending && <div className="my-auto text-zinc-500 flex-1 flex flex-col items-center justify-center p-1 text-center">Loading... </div>}
            {data && data.length === 0 && <div className="my-auto text-zinc-500 flex-1 flex flex-col items-center justify-center p-6 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                    Start the conversation by sending your first message to Contact Name.
                </p>
            </div>}
            {
                account && data && data.length > 0 && data.map((c: Chat) => <div key={c._id} id={c._id} className={`relative w-full h-auto my-6 flex ${c.sender === account.idUser ? 'justify-end' : 'justify-start'}`}>
                    <div className='w-auto max-w-[70%] h-auto min-h-[20px]'>
                        <Message reverse={c.sender === account.idUser}
                            classContent={`w-full h-auto min-h-[20px] ${reply && reply.id === c._id ? 'bg-blue-700 bg-opacity-30' : ''} rounded-md transition-all mb-4`}
                            title={c.sender === account.idUser ? 'You' : c.name!} avatar={c.sender === account.idUser ? account.avatar : c.avatar!}
                            content={c.message}
                            time={`${formatDate(c.time)} - ${isToday(c.date!)}`}
                            reply={{ id: c.replyId!, content: c.replyContent!, info: c.replyInfo! }}
                            handleReply={() => handleScrollReply(c.replyId!)}
                        />
                        <div className={`block absolute -bottom-1 ${c.sender === account.idUser ? 'right-12' : 'left-12'} flex justify-start items-center`}>
                            {c.sender === account.idUser && <MessageReplyUI
                                click={() => setReply({ id: c._id!, content: c.message, name: c.name!, time: `${formatDate(c.time)} - ${isToday(c.date!)}` })}
                            />}
                            {c.emoji.map((e: any) => e.idUser).filter((e: any) => e.includes(account.idUser)).length === 0 ? <>
                                <Tooltip
                                    placement={c.sender === account.idUser ? 'top-end' : 'top-start'}
                                    content={
                                        <EmojiPicker reactions={['2764-fe0f', '1f44d', '1f44e', '1f621', '1f604', '1f622', '1f44c', '1f44b']} reactionsDefaultOpen={true}
                                            onReactionClick={(e: EmojiClickData) => handleReaction(e, c._id as string, c.emoji)} />
                                    }>
                                    <div
                                        className={`w-6 cursor-pointer rounded-md transition-all`}>
                                        <ReactionIcon className="w-6 h-6 mx-auto" />
                                    </div>
                                </Tooltip>
                                <div
                                    className={`${c.emoji.length > 0 ? 'block' : 'hidden'} w-6 flex justify-around items-center cursor-pointer rounded-md bg-zinc-500 transition-all`}>
                                    {c.emoji.map((e: any) => e.emoji)}
                                </div>
                            </>
                                : <div
                                    className={`w-auto flex justify-around items-center cursor-pointer rounded-md bg-zinc-500 transition-all`}>
                                    {new Set(c.emoji.map((e: any) => e.emoji))}
                                </div>
                            }
                            {c.sender !== account.idUser && <MessageReplyUI
                                click={() => setReply({ id: c._id!, content: c.message, name: c.name!, time: `${formatDate(c.time)} - ${isToday(c.date!)}` })}
                            />}
                        </div>
                    </div>

                </div>)
            }
            {!chat && <EmptyChat />}
            <div ref={messagesEndRef} />
        </div>
        {
            (account && info && info.userAction.filter((e: any) => e.idUser === account.idUser && e.date !== null).length === 0 && chat)
            && <div className={`message-input w-full ${!reply ? 'h-[8%]' : 'h-[15%]'} max-h-[15%] grid grid-cols-12 grid-rows-7 gap-1 pt-2 transition-all`}>
                {reply && <div className='relative bg-zinc-500 bg-opacity-70 col-span-12 row-span-3 h-full p-1 rounded-md overflow-hidden' >
                    <CloseIcon onClick={() => setReply(null)} className='absolute top-1 right-1 w-5 h-5 cursor-pointer' />
                    <p className='text-zinc-100 text-sm font-semibold'>Reply {reply.name} - {reply.time}</p>
                    <div className='w-full h-full max-h-full text-zinc-100'
                        dangerouslySetInnerHTML={{ __html: reply.content.includes('<p>') ? reply.content : `<p>[Images]</p>` }}
                    />
                </div>
                }
                <div className={`col-span-5 xl:col-span-2 rounded-md ${reply ? 'row-span-4' : 'row-span-7'} flex justify-evenly items-center border border-solid border-zinc-400`}>
                    <EmojiIcon onClick={() => setShowPicker(!showPicker)} className='w-7 h-7 cursor-pointer' />
                    {<label>
                        <ImageIcon className='w-7 h-7 cursor-pointer' />
                        <input multiple onChange={(e) => handleUploadImage(e)} type="file" accept='image/*' className='hidden' />
                    </label>}

                    <FileIcon className='w-6 h-6 cursor-pointer' />
                    <TagMore className='w-7 h-7 cursor-pointer' />
                </div>
                {showPicker && <EmojiPicker style={{ position: 'absolute', bottom: '60px', left: '0' }} onEmojiClick={onEmojiClick} />}
                <div className={`col-span-7 xl:col-span-10 ${reply ? 'row-span-4' : 'row-span-7'}`}>
                    <Input placeholder='Message...'
                        endContent={
                            <Button isIconOnly className='h-full rounded-md text-white bg-zinc-950 px-1' onClick={handleSendMessage}>
                                <MessageUpload className='w-7 h-7 ' />
                            </Button>
                        }
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        value={value} onChange={(e) => setValue(e.target.value)}
                        radius='sm'
                        type="text"
                        classNames={{
                            inputWrapper: 'w-full h-full rounded-md text-white px-1 border border-solid border-zinc-400 p-1',
                            base: `w-full h-[99%]`,
                        }}
                        className='text-white px-1' />
                </div>

            </div>

        }
        {
            (account && info && info.userAction.filter((e: any) => e.idUser === account.idUser && e.date !== null).length !== 0 && chat)
            && <div className={`message-input text-zinc-500 w-full ${!reply ? 'h-[8%]' : 'h-[15%]'} max-h-[15%] flex justify-center items-center pt-2 transition-all`}>
                You have left the group
            </div>
        }
    </section >
}

export default ChatDetail