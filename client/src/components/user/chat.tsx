import React, { use, useEffect } from 'react'
import Message from '../chat/message'
import { chatStore } from '@/stores/chat'
import { Chat, ChatByUser } from '@/interface/chat'
import { StateContext } from '@/context/state'
import socket from '@/utils/socket'
import { accountStore } from '@/stores/account'

const ListChat = () => {
    const { account } = accountStore()
    const { list, setList } = chatStore()
    const { setChat } = use(StateContext)
    const handleClick = (id: string, name: string, avatar: string) => {
        setChat({
            _id: id,
            name: name,
            avatar: avatar,
        })
    }
    useEffect(() => {
        socket.on('s_g_r_create_group', (data: any) => {
            if (data.type && data.type === "add") {
                const includesMessage = list && list.filter((c: ChatByUser) => c._id === data.data._id)
                includesMessage?.length === 0 && list && setList([data.data, ...list])
            }

            if (data.type && data.type === "remove") {
                list && setList(list.filter((c: ChatByUser) => c._id !== data.data._id))
            }

            !data.type && account && list
                && list.filter((c: ChatByUser) => c._id === data._id).length === 0
                && data.user.includes(account.idUser) && setList([data, ...list])
        })
        socket.on('s_g_r_chat', (data: Chat) => {
            const currentChat = list && list.filter((c: ChatByUser) => c._id === data.idChat)
            const newChat = list && list.filter((c: ChatByUser) => c._id !== data.idChat)
            currentChat && newChat && setList([{
                ...currentChat[0],
                lastMessage: data.message
            }, ...newChat])

        })
        return () => {
            socket.off('s_g_r_chat')
            socket.off('s_g_r_create_group')
        }
    }, [list, account])
    return <div className='w-full h-full bg-zinc-950 bg-opacity-70 rounded-md'>
        <div className='w-[99%] h-full py-2 overflow-y-auto'>
            {list && list.length > 0 &&
                list.map((c: ChatByUser) =>
                    c.lastMessage && <Message onClick={() => handleClick(c._id, c.name, c.avatar)} key={c._id} reverse={false} classContent="w-full h-auto"
                        title={c.name} avatar={c.avatar}
                        content={c.lastMessage} />
                )
            }
        </div>
    </div>
}

export default ListChat