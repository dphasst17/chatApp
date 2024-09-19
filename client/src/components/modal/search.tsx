import { addFriend, friendRemove, friendUpdate } from '@/api/account'
import { Friend, Search } from '@/interface/account'
import { accountStore } from '@/stores/account'
import { getToken } from '@/utils/cookie'
import { Avatar, Button, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const SearchModal = ({ data, setModal, onClose }: { data: any, setModal?: React.Dispatch<React.SetStateAction<string>>, onClose: () => void }) => {
    const { account, friend, friendPending, setFriend, setFriendPending } = accountStore()
    const [friendList, setFriendList] = useState<{ friend: any[], pending: string[], request: string[] } | null>(null)
    useEffect(() => {
        friend && setFriendList((prev: any) => ({ ...prev, friend: friend.map((f: Friend) => ({ idUser: f.idUser, idFriend: f.idFriend })) }))
        friendPending && setFriendList((prev: any) => ({
            ...prev,
            pending: friendPending.map((f: Friend) => f.idFriend),
            request: friendPending.map((f: Friend) => f.idUser)
        }))
    }, [friend, friendPending])
    const handleAddFriend = async (id: string) => {
        const token = await getToken()
        const data = {
            idFriend: id,
            status: 'pending',
            created_at: new Date(),
            updated_at: new Date(),
        }
        const info = {
            avatar: account?.avatar!,
            name: account?.name!,
            online: account?.online!
        }
        account && token && addFriend(token, { data, info }).then((res) => {
            if (res.status === 201) {
                toast.success(res.message)
                /* friendPending && setFriendPending([...friendPending, res.data]) */
            }
        })
    }
    const handleAccept = (id: string) => {
        friendUpdate({ id: id, detail: { status: 'accepted' } })
            .then((res) => {
                if (res.status === 200) {
                    const dataFriend = friendPending && friendPending.filter((f: Friend) => f._id === id)[0]
                    friend && dataFriend && setFriend([...friend, dataFriend]);
                    friendPending && setFriendPending(friendPending.filter((f: Friend) => f._id !== id))
                }
            })
    }
    const handleRemove = (type: string, id: string) => {
        friendRemove(id)
            .then((res) => {
                if (res.status === 200) {
                    if (type === 'friend') {
                        friend && setFriend(friend.filter((f: Friend) => f._id !== id))
                        setFriendList((prev: any) => ({ ...prev, friend: prev.friend.filter((f: string) => f !== id) }))
                    }
                    if (type === 'pending') {
                        friendPending && setFriendPending(friendPending.filter((f: Friend) => f._id !== id))
                        setFriendList((prev: any) => ({ ...prev, pending: prev.pending.filter((f: string) => f !== id) }))
                    }
                }
            })
    }
    useEffect(() => {
        console.log(friendList)
    }, [friendList])
    const emptyAvatar = 'https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png'
    return <ModalContent>
        <ModalHeader>Friend Request</ModalHeader>
        <ModalBody>
            <div className='w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-2 gap-2 overflow-auto'>
                {account && friendList && data.map((f: Search) => <div key={f._id} className='h-[60px] grid grid-cols-5 border border-solid border-zinc-200 rounded-md hover:bg-zinc-100 transition-all'>
                    <Avatar alt='' src={f.avatar ? f.avatar : emptyAvatar} radius='sm' size='md' className='col-span-1 m-auto' />
                    <div className='col-span-4'>
                        <p className='px-2 py-1 h-2/4 flex items-center text-sm truncate cursor-pointer'>{f.name}</p>
                        {account.idUser !== f.idUser &&
                            <div className='w-full h-2/4 grid grid-cols-6'>
                                {(friendList.friend.filter((ff: Friend) => (ff.idUser === f.idUser || ff.idFriend === f.idUser)).length === 0)
                                    && !friendList.pending.includes(f.idUser) && !friendList.request.includes(f.idUser) &&
                                    <div onClick={() => handleAddFriend(f.idUser)} className='col-span-2 h-6 cursor-pointer text-[14px] rounded-md text-white bg-green-600 ml-2 flex items-center justify-center'>
                                        Add friend
                                    </div>
                                }
                                {(friendList.request.includes(f.idUser)) &&
                                    <>
                                        <div
                                            onClick={() => friendPending && handleAccept(friendPending.filter((p: Friend) => p.idUser === f.idUser || p.idFriend === f.idUser)[0]._id)}
                                            className='col-span-2 h-6 cursor-pointer text-[14px] rounded-md bg-green-500 text-white ml-2 flex items-center justify-center'>
                                            Acept
                                        </div>
                                        <div
                                            onClick={() => friendPending && handleRemove('pending', friendPending.filter((p: Friend) => p.idUser === f.idUser || p.idFriend === f.idUser)[0]._id)}
                                            className='col-span-2 h-6 cursor-pointer text-[14px] rounded-md bg-red-600 text-white ml-2 flex items-center justify-center'>
                                            Reject
                                        </div>
                                    </>
                                }
                                {(friendList.pending.includes(f.idUser)) &&
                                    <>
                                        <div className='col-span-2 h-6 cursor-pointer text-[14px] rounded-md bg-zinc-300 ml-2 flex items-center justify-center'>
                                            Pending
                                        </div>
                                        <div
                                            onClick={() => friendPending && handleRemove('pending', friendPending.filter((p: Friend) => p.idUser === f.idUser || p.idFriend === f.idUser)[0]._id)}
                                            className='col-span-2 h-6 cursor-pointer text-[14px] rounded-md bg-red-600 text-white ml-2 flex items-center justify-center'>
                                            Reject
                                        </div>
                                    </>
                                }
                                {(friendList.friend.filter((ff: Friend) => (ff.idUser === f.idUser || ff.idFriend === f.idUser)).length !== 0) &&
                                    <div
                                        onClick={() => friend && handleRemove('friend', friend.filter((p: any) => p.idUser === f.idUser || p.idFriend === f.idUser)[0]._id)}
                                        className='col-span-2 h-6 cursor-pointer text-[14px] rounded-md bg-red-600 text-white ml-2 flex items-center justify-center'>
                                        Remove
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>)}
            </div>
        </ModalBody>
        <ModalFooter>
            <Button color='danger' onClick={() => { setModal && setModal(''), onClose() }}>Close</Button>
        </ModalFooter>
    </ModalContent>
}

export default SearchModal