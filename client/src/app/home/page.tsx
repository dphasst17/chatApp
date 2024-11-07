'use client'
import React, { use, useEffect } from 'react'
import UserComponent from './user'
import ChatComponent from './chat'
import { accountStore } from '@/stores/account'
import socket from '@/utils/socket'
import { toast } from 'react-toastify'
import { Friend } from '@/interface/account'
import { StateContext } from '@/context/state'

const Home = () => {
    const { account, friend, setFriend, friendPending, setFriendPending } = accountStore()
    const { mode } = use(StateContext)
    useEffect(() => {
        socket.emit('s_g_r_checked', (text: string) => {
            console.log(text)
        })
        window.addEventListener('beforeunload', () => {
            account && socket.emit('u_disconnect', account.idUser)
        });
        socket.on('s_g_r_online', (data: string) => {
            friend && setFriend(friend.map((f: Friend) => {
                return f.friend.idUser === data ? {
                    ...f,
                    friend: {
                        ...f.friend,
                        online: true
                    }
                } : f
            }))
        })
        socket.on('s_g_r_offline', (data: string) => {
            friend && setFriend(friend.map((f: Friend) => {
                return {
                    ...f,
                    friend: {
                        ...f.friend,
                        online: data === f.friend.idUser ? false : f.friend.online
                    }
                }
            }))
        })
        socket.on('s_g_r_friend', (data: any) => {
            if (account && friendPending && data.idFriend === account.idUser) {
                setFriendPending([...friendPending, data])
                toast.success(`${data.friend.name} sent you a friend request`)
            }
        })
        return () => {
            socket.off('s_g_r_checked')
            socket.off('s_g_r_online')
            socket.off('s_g_r_offline')
            socket.off('s_g_r_friend')
        }
    }, [account, friendPending])
    return account ? <div className={`${mode} w-full h-screen overflow-hidden grid grid-cols-8 gap-2 py-1 px-2 transition-all`}>
        <UserComponent />
        <ChatComponent />
    </div> : <div className='empty w-full h-screen'></div>
}

export default Home