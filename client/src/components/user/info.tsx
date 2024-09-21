'use client'
import { Avatar, Badge, Button, Input, Modal, Popover, PopoverContent, PopoverTrigger, useDisclosure } from '@nextui-org/react'
import React, { use, useEffect, useState } from 'react'
import { FriendAdd, GroupLine, SearchIcon, UserEdit } from '../icon/icon'
import { accountStore } from '@/stores/account'
import { remove } from '@/utils/cookie'
import { StateContext } from '@/context/state'
import { useRouter } from 'next/navigation'
import { friendRemove, friendUpdate, searchUser } from '@/api/account'
import { Friend, Search } from '@/interface/account'
import socket from '@/utils/socket'
import FriendConfirm from '../modal/friend.confirm'
import SearchModal from '../modal/search'
/* import { toast } from 'react-toastify' */

const UserInfo = () => {
    const { setIsLog } = use(StateContext)
    const { account, friend, friendPending, setAccount, setFriendPending } = accountStore()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [searchData, setSearchData] = useState<Search[] | null>(null)
    const { isOpen: isOpenModal, onOpen, onClose, onOpenChange } = useDisclosure()
    /* const [modal, setModal] = useState<string>('') */
    const router = useRouter()
    const emptyAvatar = 'https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png'
    let timeout: any = null
    useEffect(() => {
        socket.on('s_g_r_friend', (data: any) => {
            account && data.idUser !== account.idUser && (data.idFriend === account.idUser) ? 'append data to friend pending' : ''
        })
    }, [])
    const handleLogout = () => {
        remove('c-atk')
        remove('c-rtk')
        remove('c-log')
        setIsLog(false)
        setAccount(null)
        router.push('/auth')
    }
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value ? setIsOpen(true) : setIsOpen(false)
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            e.target.value ? setSearch(e.target.value) : setSearch('')
            e.target.value !== '' && searchUser(e.target.value).then((res) => {
                if (res.status === 200) {
                    res.data.length !== 0 && setSearchData(res.data)
                    res.data.length === 0 && setSearchData(null)
                }
            })
        }, 1000)
    }
    const handleChangeStatusFriend = (id: string, status: string) => {
        if (status === "accept") {
            friendUpdate({ id: id, detail: { status: 'accepted' } })
                .then((res) => {
                    if (res.status === 200) {
                        const dataFriend = friendPending && friendPending.filter((f: Friend) => f._id === id)[0]
                        friend && dataFriend && setFriendPending(friendPending.filter((f: Friend) => f._id !== id))
                    }
                })
        }
        if (status === "decline") {
            friendRemove(id)
                .then((res) => {
                    if (res.status === 200) {
                        friendPending && setFriendPending(friendPending.filter((f: Friend) => f._id !== id))
                    }
                })
        }
    }
    return account && <div className='w-full h-full bg-zinc-950 bg-opacity-70 rounded-md flex flex-wrap justify-around items-center'>
        <Avatar alt='' src={account.avatar ? account.avatar : emptyAvatar} radius='sm' size='lg' />
        <div className='w-4/5 h-full flex flex-col items-center justify-center'>
            <div className='info w-full grid grid-cols-9 gap-x-2 mb-1 px-1'>
                <p className='col-span-6 truncate text-lg font-semibold'>{account.name}</p>
                <UserEdit className='col-span-1 w-8 h-8 rounded-md cursor-pointer' />
                <GroupLine className='col-span-1 w-8 h-8 rounded-md cursor-pointer' />
                <Popover>
                    <PopoverTrigger>
                        <div className='col-span-1 rounded-md cursor-pointer'>
                            <Badge content={friendPending ? friendPending.filter((f: Friend) => f.idFriend === account.idUser).length : 0} color='danger' placement='top-right' classNames={{ badge: 'w-4 h-4 ml-10' }}>
                                <FriendAdd className='w-8 h-8' />
                            </Badge>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent>
                        {friendPending && friendPending.filter((f: Friend) => f.idFriend === account.idUser).map((f: Friend) => <div className='w-full h-[50px] grid grid-cols-12 gap-2' key={f._id}>
                            <div className='col-span-2 flex justify-center items-center'>
                                <Avatar isBordered color='success' alt={`avatar-${f.friend.name}`} src={f.friend.avatar} size='md' radius="sm" />
                            </div>
                            <div className='col-span-10'>
                                <p className='truncate'>{f.friend.name}</p>
                                {
                                    f.idUser !== account.idUser ? <>
                                        <Button size="sm" color="success" radius="sm" onClick={() => handleChangeStatusFriend(f._id, 'accept')}
                                            className='max-h-[20px] text-white'>Accept</Button>
                                    </>
                                        : <Button size="sm" color="default" radius="sm" className='max-h-[20px] text-white'>Pending</Button>
                                }
                                <Button size="sm" color="danger" radius="sm" onClick={() => handleChangeStatusFriend(f._id, 'decline')}
                                    className='max-h-[20px] ml-2'>Decline</Button>
                            </div>
                        </div>)}
                    </PopoverContent>
                </Popover>
            </div>
            <div className='icon w-full grid grid-cols-6 gap-x-2 px-1'>
                <div className='relative col-span-5'>
                    <Input onChange={handleSearch} size='sm' type="text" placeholder='Search' className='w-full' defaultValue={search}
                        endContent={<SearchIcon className='w-6 h-6 cursor-pointer  rounded-md' />} />
                    {isOpen && <div className='absolute top-10 left-0 w-full h-auto min-h-[80px] max-h-[250px] bg-zinc-800 rounded-md'>
                        <Button size="sm" isIconOnly color='danger' className='m-1' onClick={() => { setSearch(''); setIsOpen(false) }}>X</Button>
                        {!searchData && <p className='text-center'>No data result</p>}
                        {searchData && searchData.slice(0, 5).map((s: Search) => <div className='w-[95%] h-[50px] grid grid-cols-5 mx-auto my-2 rounded-md hover:bg-zinc-700 cursor-pointer transition-all' key={`search-${s._id}`}>
                            <Avatar alt='' src={s.avatar ? s.avatar : emptyAvatar} radius='sm' size='md' className='col-span-1 m-auto' />
                            <div className='col-span-4'>
                                <p className='px-2 py-1 h-full flex items-center text-sm truncate cursor-pointer'>{s.name}</p>
                            </div>
                        </div>)}
                        {searchData && searchData.length > 1 && <div className='w-full flex justify-center'>
                            <Button onPress={onOpen} size="sm" className='!mx-auto mt-1 mb-4'>Show all</Button>
                        </div>}
                    </div>}
                </div>
                <Button onClick={handleLogout} color='danger' size="sm" className='col-span-1 text-sm font-semibold'>Logout</Button>
            </div>
        </div>
        <Modal isOpen={isOpenModal} onOpenChange={onOpenChange} size="3xl">
            <SearchModal data={searchData} onClose={onClose} />
        </Modal>
    </div >
}

export default UserInfo