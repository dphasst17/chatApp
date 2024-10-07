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
    return <div className='h-[99%] col-span-8 md:col-span-3 xl:col-span-2 
    text-black md:bg-transparent grid grid-cols-1 gap-y-1 md:p-0 p-1 rounded-md items-start z-0'>
        <div className='user h-[22vh] ssm:h-[15vh] md:h-[18vh] lg:h-[15vh]'>
            <UserInfo />
        </div>
        <div className='chat h-[13vh] shadow-custom rounded-md p-2'>
            <Button size="sm" color="primary" className='h-1/5 rounded-md' radius="none" onPress={onOpen}>Create group</Button>
            <div className='friendOnline w-full h-4/5 flex overflow-auto'>
                {friend && friend.map((f: Friend) => <div key={f._id} className='w-[100px] h-full flex flex-col justify-center items-center mx-1'>
                    <Avatar isBordered radius='sm' alt='avatar' color={f.friend.online ? 'success' : 'default'} src={f.friend.avatar} size='md' />
                    <p className='text-center text-black mt-1'>{f.friend.name}</p>
                </div>)}
            </div>
        </div>
        <div className='friend h-[63vh] ssm:h-[70vh] md:h-[67vh] lg:h-[70vh] py-1'>
            <ListChat />
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
            <ModalCreateGroup onClose={onClose} />
        </Modal>
    </div>
}


export default UserComponent