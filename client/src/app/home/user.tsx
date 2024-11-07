'use client'
import { updateUser } from '@/api/account'
import ModalCreateGroup from '@/components/modal/group.create'
import ListChat from '@/components/user/chat'
import UserInfo from '@/components/user/info'
import { StateContext } from '@/context/state'
import { Friend } from '@/interface/account'
import { accountStore } from '@/stores/account'
import { getToken, remove } from '@/utils/cookie'
import socket from '@/utils/socket'
import { Avatar, Button, Modal, useDisclosure } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React, { use } from 'react'
import { toast } from 'react-toastify'

const UserComponent = () => {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
    const { friend, account, setAccount } = accountStore()
    const { mode, setIsLog } = use(StateContext)
    const router = useRouter()
    const handleLogout = async () => {
        const token = await getToken()
        token && updateUser(token, { online: false })
            .then((res) => {
                if (res.status !== 200) {
                    toast.error(res.message)
                    return
                }
                remove('c-atk')
                remove('c-rtk')
                remove('c-log')
                setIsLog(false)
                setAccount(null)
                account && socket.emit('u_disconnect', account.idUser)
                router.push('/auth')
            })
    }
    return <div className='h-[99%] col-span-8 md:col-span-3 xl:col-span-2 
    md:bg-transparent grid grid-cols-1 gap-y-1 md:p-0 p-1 rounded-md items-start z-0'>
        <div className='user h-[22vh] ssm:h-[15vh] md:h-[18vh] lg:h-[15vh]'>
            <UserInfo />
        </div>
        <div className='chat h-[16vh] lg:h-[13vh] shadow-custom rounded-md p-2'>
            <Button size="sm" color="primary" className='h-1/5 rounded-md' radius="none" onPress={onOpen}>Create group</Button>
            <div className='friendOnline w-full h-4/5 flex overflow-y-auto'>
                {friend && friend.map((f: Friend) => <div key={f._id} className='w-[100px] h-full flex flex-col justify-center items-center mx-1'>
                    <Avatar isBordered radius='sm' alt='avatar' color={f.friend.online ? 'success' : 'default'} src={f.friend.avatar} size='md' />
                    <p className={`text-center ${mode === "light" ? "!text-zinc-900" : "!text-zinc-100"} mt-1 truncate`}>{f.friend.name}</p>
                </div>)}
            </div>
        </div>
        <div className='friend h-[52vh] ssm:h-[59vh] md:h-[56vh] lg:h-[62vh] py-1'>
            <ListChat />
        </div>
        <div className='w-full h-[8vh] flex flex-col justify-around items-center py-1'>
            <Button onClick={handleLogout} color='danger' size="sm" className='w-32 text-sm font-semibold'>Logout</Button>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
            <ModalCreateGroup onClose={onClose} />
        </Modal>
    </div>
}


export default UserComponent