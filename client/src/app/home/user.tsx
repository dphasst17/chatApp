'use client'
import ModalCreateGroup from '@/components/modal/group.create'
import ListChat from '@/components/user/chat'
import UserInfo from '@/components/user/info'
import { Friend } from '@/interface/account'
import { accountStore } from '@/stores/account'
import { Avatar, Button, Modal, useDisclosure } from '@nextui-org/react'
import React from 'react'

const UserComponent = () => {
    const { friend } = accountStore()
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
    return <div className='col-span-2 h-[99%] text-white grid grid-cols-1 gap-y-1 items-start'>
        <div className='user h-[15vh]'>
            <UserInfo />
        </div>
        <div className='chat h-[13vh] bg-zinc-950 bg-opacity-70 rounded-md p-2'>
            <Button size="sm" color="primary" className='h-1/5 rounded-md' radius="none" onPress={onOpen}>Create group</Button>
            <div className='friendOnline w-full h-4/5 flex overflow-auto'>
                {friend && friend.map((f: Friend) => <div key={f._id} className='w-[100px] h-full flex flex-col justify-center items-center mx-1'>
                    <Avatar isBordered radius='sm' alt='avatar' color={f.friend.online ? 'success' : 'default'} src={f.friend.avatar} size='md' />
                    <p className='text-center text-white mt-1'>{f.friend.name}</p>
                </div>)}
            </div>
        </div>
        <div className='friend h-[70vh] py-1'>
            <ListChat />
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
            <ModalCreateGroup onClose={onClose} />
        </Modal>
    </div>
}


export default UserComponent