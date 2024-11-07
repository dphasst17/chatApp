'use client'
import { Avatar, Badge, Button, Input, Modal, Popover, PopoverContent, PopoverTrigger, useDisclosure } from '@nextui-org/react'
import React, { use, useEffect, useState } from 'react'
import { EditImageIcon, FriendAdd, GroupLine, MoonIcon, SearchIcon, SunIcon, UserEdit } from '../icon/icon'
import { accountStore } from '@/stores/account'
import { friendRemove, friendUpdate, searchUser } from '@/api/account'
import { Friend, Search } from '@/interface/account'
import socket from '@/utils/socket'
import SearchModal from '../modal/search'
import FriendList from '../modal/friend.list'
import AccountEdit from '../modal/account.edit'
import AvatarEdit from '../modal/account.avatar.edit'
import { StateContext } from '@/context/state'

const UserInfo = () => {
    const { account, friend, friendPending, setFriendPending, setFriend } = accountStore()
    const { mode, setMode } = use(StateContext)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [searchData, setSearchData] = useState<Search[] | null>(null)
    const { isOpen: isOpenModal, onOpen, onClose, onOpenChange } = useDisclosure()
    const [modal, setModal] = useState<string>('')
    const emptyAvatar = 'https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png'
    let timeout: any = null
    useEffect(() => {
        socket.on('s_g_r_friend', (data: any) => {
            account && data.idUser !== account.idUser && (data.idFriend === account.idUser) ? 'append data to friend pending' : ''
        })
    }, [])
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
                        friend && dataFriend && setFriend([...friend, dataFriend]);
                        dataFriend && setFriendPending(friendPending.filter((f: Friend) => f._id !== id))
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
    const handleSetMode = (mode: "light" | "dark") => {
        setMode(mode)
        localStorage.setItem('mode', mode)
    }
    return account && <div className='w-full h-full rounded-md flex flex-wrap justify-around items-center'>
        <Badge classNames={{ badge: 'rounded-md !ml-12 bg-transparent border-none' }}
            content={<EditImageIcon onClick={() => { setModal('avatar'), onOpen() }} className='w-7 h-7 cursor-pointer' />
            }
            shape='rectangle' placement='bottom-right'>
            <Avatar alt='' src={account.avatar ? account.avatar : emptyAvatar} radius='sm' size='lg' />
        </Badge>
        <div className='w-4/5 min-w-[240px] md:h-2/4 lg:h-full flex flex-col items-center justify-center'>
            <div className='info w-full grid grid-cols-8 ssm:grid-cols-10 gap-x-2 mb-1 px-1'>
                <p className={`col-span-8 ssm:col-span-6 truncate text-center ssm:text-start ${mode === "light" ? "!text-zinc-700" : "!text-zinc-200"} text-lg font-semibold my-2 ssm:my-0`}>{account.name}</p>
                {mode === "light" && <SunIcon onClick={() => handleSetMode("dark")} className='col-span-2 mx-auto ssm:col-span-1 w-8 h-8 rounded-md cursor-pointer' />}
                {mode === "dark" && <MoonIcon onClick={() => handleSetMode("light")} className='col-span-2 mx-auto ssm:col-span-1 w-8 h-8 rounded-md cursor-pointer' />}
                <UserEdit onClick={() => { setModal('edit'), onOpen() }} className='col-span-2 mx-auto ssm:col-span-1 w-8 h-8 rounded-md cursor-pointer' />
                <GroupLine onClick={() => { setModal('friend'), onOpen() }} className='col-span-2 mx-auto ssm:col-span-1 w-8 h-8 rounded-md cursor-pointer' />
                <Popover>
                    <PopoverTrigger>
                        <div className='col-span-2 mx-auto ssm:col-span-1 rounded-md cursor-pointer'>
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
            <div className='icon w-full grid grid-cols-8 gap-x-1'>
                <div className='relative col-span-8'>
                    <Input onChange={handleSearch} size='sm' type="text" placeholder='Search' className='w-full' defaultValue={search}
                        endContent={<SearchIcon className='w-6 h-6 cursor-pointer  rounded-md' />} />
                    {isOpen && <div className={`absolute top-10 left-0 w-full h-auto min-h-[80px] max-h-[300px] 
                        ${mode === "light" ? "bg-zinc-100 text-zinc-900" : "bg-zinc-800 text-zinc-50"} rounded-md z-40`}>
                        <Button size="sm" isIconOnly color='danger' className='m-1' onClick={() => { setSearch(''); setIsOpen(false) }}>X</Button>
                        {!searchData && <p className='text-center'>No data result</p>}
                        {searchData && searchData.slice(0, 5).map((s: Search) =>
                            <div className='w-[95%] h-[50px] grid grid-cols-5 mx-auto my-2 rounded-md hover:bg-zinc-600 hover:text-zinc-100 cursor-pointer transition-all'
                                key={`search-${s._id}`}>
                                <Avatar alt='' src={s.avatar ? s.avatar : emptyAvatar} radius='sm' size='md' className='col-span-1 m-auto' />
                                <div className='col-span-4'>
                                    <p className='px-2 py-1 h-full flex items-center text-sm truncate cursor-pointer'>{s.name}</p>
                                </div>
                            </div>)}
                        {searchData && searchData.length > 1 && <div className='w-full flex justify-center'>
                            <Button onPress={() => { setModal('search'), onOpen() }} size="sm" className='!mx-auto mt-1 mb-4'>Show all</Button>
                        </div>}
                    </div>}
                </div>
            </div>
        </div>
        <Modal isOpen={isOpenModal} onOpenChange={onOpenChange} size="3xl">
            {modal === 'search' && <SearchModal data={searchData} setModal={setModal} onClose={onClose} />}
            {modal === 'friend' && <FriendList setModal={setModal} onClose={onClose} />}
            {modal === 'edit' && <AccountEdit onClose={onClose} setModal={setModal} />}
            {modal === 'avatar' && <AvatarEdit onClose={onClose} setModal={setModal} />}
        </Modal>
    </div >
}

export default UserInfo