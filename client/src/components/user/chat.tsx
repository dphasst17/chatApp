import React, { use, useEffect } from 'react'
import Message from '../chat/message'
import { chatStore } from '@/stores/chat'
import { Chat, ChatByUser } from '@/interface/chat'
import { StateContext } from '@/context/state'
import socket from '@/utils/socket'

const ListChat = () => {
    const { list, setList } = chatStore()
    const { setChat } = use(StateContext)
    const handleClick = (id: string, name: string, avatar: string) => {
        setChat({
            _id: id,
            name: name,
            avatar: avatar
        })
    }
    useEffect(() => {
        socket.on('s_g_r_chat', (data: Chat) => {
            list && setList(list.map((c: ChatByUser) => {
                return {
                    ...c,
                    lastMessage: data.idChat === c._id ? data : c.lastMessage
                }
            }))
        })
        return () => {
            socket.off('s_g_r_chat')
        }
    }, [list])
    return <div className='w-full h-full bg-zinc-950 bg-opacity-70 rounded-md'>
        <div className='w-[99%] h-full py-2 overflow-y-auto'>
            {list && list.length > 0 ?
                list.map((c: ChatByUser) =>
                    <Message onClick={() => handleClick(c._id, c.name, c.avatar)} key={c._id} reverse={c.user[0] === c.user[1]} classContent="w-full h-[20px]"
                        title={c.name} avatar={c.avatar}
                        content={c.lastMessage ? c.lastMessage.message.includes('<p') ? c.lastMessage.message : 'Images' : '<p class="text-zinc-300">No message</p>'} />
                )
                : <p className='text-center text-white'>No chat</p>}
        </div>
    </div>
}

export default ListChat