'use client'
import ChatDetail from '@/components/chat/chat'
import { StateContext } from '@/context/state'
import { Avatar } from '@nextui-org/react'
import React, { use } from 'react'

const Chat = () => {
    const { chat } = use(StateContext)
    return <div className='col-span-6 h-[99vh] rounded-md text-red-500'>
        <div className='w-full h-full rounded-md flex flex-col justify-between'>
            <section className='w-full h-[10%] min-h-[80px] grid grid-cols-12 bg-zinc-950 bg-opacity-70 rounded-md' >
                {chat && <>
                    <div className='col-span-1 h-full flex items-center justify-center'>
                        <Avatar radius='sm' alt='avatar' src={chat.avatar} size='lg' />
                    </div>
                    <div className='col-span-9 flex items-center'>
                        <p className='text-xl font-bold'>{chat.name}</p>
                    </div>
                </>}
            </section>
            <ChatDetail />
        </div>
    </div>
}

export default Chat