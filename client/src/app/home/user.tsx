'use client'
import ModalCreateGroup from '@/components/modal/group.create'
import ListChat from '@/components/user/chat'
import UserInfo from '@/components/user/info'
import { StateContext } from '@/context/state'
import { Friend } from '@/interface/account'
import { accountStore } from '@/stores/account'
import { Avatar, Button, Modal, useDisclosure } from '@nextui-org/react'
import React, { use, useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { motion } from 'framer-motion'
const UserComponent = () => {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
    const { friend } = accountStore()
    const { mode } = use(StateContext)
    const [modalName, setModalName] = useState<string>()
    const emptyAvatar = 'https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png'
    const handleOnpenModal = (name: string) => {
        onOpen()
        setModalName(name)
    }
    return <div className='h-full col-span-8 md:col-span-3 xl:col-span-2 
    md:bg-transparent grid-flow-row grid grid-rows-12 lg:grid-rows-11 grid-cols-1 gap-y-4 rounded-md z-0 overflow-hidden'>
        <div className='user row-span-3 lg:row-span-2 col-span-1'>
            <UserInfo />
        </div>
        <div className='chat row-span-4 lg:row-span-3 col-span-1 flex flex-col justify-around rounded-md p-2'>
            <motion.div drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2}
                className='friendOnline w-full h-3/4 flex overflow-x-hidden py-2 cursor-grab select-none hiddenScrollbar'>
                {friend && friend.map((f: Friend, i: number) => <Fade key={f._id} direction='down' delay={i * 100} className='w-[100px] min-w-[100px] h-full max-h-[152px] mx-1 overflow-x-hidden'>
                    <div className='relative w-full h-full flex flex-col justify-end items-center'>
                        {/* feature: add story, if user doesn't have story then show avatar */}
                        <div className='absolute story w-full h-full z-0 rounded-md'>
                            <img src={f.friend.avatar || emptyAvatar} className='w-full h-full object-cover rounded-md' alt={`story-${f.friend.name}`} />
                            <div className='overlay absolute top-0 w-full h-full rounded-md bg-zinc-950 bg-opacity-55'></div>
                        </div>
                        <Avatar isBordered radius='sm' alt='avatar' color={f.friend.online ? 'success' : 'default'} src={f.friend.avatar} size='md' />
                        <p className={`text-center ${mode === "light" ? "!text-zinc-900" : "!text-zinc-100"} mt-1 z-10 truncate`}>{f.friend.name}</p>
                    </div>
                </Fade>)}
            </motion.div>
            <div className='w-full h-1/4 flex justify-start items-center overflow-hidden'>
                <Button size="sm" color="primary" className='w-28 h-[30px] rounded-md' radius="none" onClick={() => handleOnpenModal('chat')}>Create group</Button>
                <Button size="sm" color="primary" className='w-28 h-[30px] rounded-md mx-2' radius="none" onClick={() => handleOnpenModal('story')}>Create Story</Button>
            </div>

        </div>
        <div className='friend row-span-5 lg:row-span-6 py-1'>
            <ListChat />
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
            {modalName === "chat" && <ModalCreateGroup onClose={onClose} />}
        </Modal>
    </div >
}


export default UserComponent