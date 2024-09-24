'use client'
import React, { useEffect } from 'react'
import User from './user'
import Chat from './chat'
import { accountStore } from '@/stores/account'
import socket from '@/utils/socket'
import { toast } from 'react-toastify'

const Home = () => {
    const { account, friendPending, setFriendPending } = accountStore()
    useEffect(() => {
        socket.emit('s_g_r_checked', (text: string) => {
            console.log(text)
        })
        socket.on('s_g_r_online', (data: any) => {
            console.log(data)
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
            socket.off('s_g_r_friend')
        }
    }, [account, friendPending])
    return account ? <div className='w-full h-screen overflow-hidden grid grid-cols-8 gap-2 py-1 px-2'>
        <User />
        <Chat />
    </div> : <div className='empty w-full h-screen'></div>
}

export default Home