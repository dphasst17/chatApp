import React, { use, useEffect } from 'react'
import Message from '../chat/message'
import { chatStore } from '@/stores/chat'
import { Chat, ChatByUser } from '@/interface/chat'
import { StateContext } from '@/context/state'
import socket from '@/utils/socket'
import { accountStore } from '@/stores/account'
import { DeleteChatIcon } from '../icon/icon'
import { Tooltip } from '@nextui-org/react'
import { getToken } from '@/utils/cookie'
import { updateChat } from '@/api/chat'

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
    const handleDelete = async (idChat: string) => {
        const getData = list && list.filter((c: ChatByUser) => c._id !== idChat)
        if (getData && account) {
            const dataUpdate = getData[0].type === "group" ? {
                user: getData[0].user.filter((c: string) => c !== account.idUser),
                userAction: getData[0].userAction.map((c: any) => {
                    return c.idUser !== account.idUser ? c : {
                        ...c,
                        date: new Date()
                    }
                })
            } : {
                userAction: getData[0].userAction.map((c: any) => {
                    return c.idUser !== account.idUser ? c : {
                        ...c,
                        date: new Date()
                    }
                })
            }
            const token = await getToken()
            token && updateChat(token, idChat, dataUpdate).then((res) => {
                if (res.status === 200) {
                    list && setList(list.filter((c: ChatByUser) => c._id !== idChat))
                }
            })
        }

    }
    useEffect(() => {
        socket.on('s_g_r_create_group', (data: any) => {
            if (data.type && data.type === "add") {
                const includesMessage = list && list.filter((c: ChatByUser) => c._id === data.data._id)
                includesMessage?.length === 0 && list && setList([data.data, ...list])
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
    return <div className='w-full h-full rounded-md'>
        <div className='w-[99%] h-full py-2 overflow-y-auto'>
            {list && list.length > 0 &&
                list.map((c: ChatByUser) =>
                    c.lastMessage && <div key={c._id} className='w-full h-auto grid grid-cols-12 gap-1'>
                        <Message onClick={() => handleClick(c._id, c.name, c.avatar)} key={c._id} reverse={false} classContent="col-span-11 h-auto"
                            title={c.name} avatar={c.avatar}
                            truncate={true}
                            content={c.lastMessage} />
                        {account && c.owner !== account.idUser && <Tooltip radius='sm' content="Delete chat" placement="left" color='danger' showArrow>
                            <div className="col-span-1 h-auto flex items-center justify-center">
                                <DeleteChatIcon onClick={() => handleDelete(c._id)} className='cursor-pointer w-6 h-6' />
                            </div>
                        </Tooltip>}
                    </div>
                )
            }
        </div>
    </div>
}

export default ListChat