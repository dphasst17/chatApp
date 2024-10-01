import { friendRemove } from '@/api/account'
import { createChat } from '@/api/chat'
import { StateContext } from '@/context/state'
import { Friend } from '@/interface/account'
import { ChatByUser } from '@/interface/chat'
import { accountStore } from '@/stores/account'
import { chatStore } from '@/stores/chat'
import { getToken } from '@/utils/cookie'
import { Avatar, Button, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React, { use } from 'react'

const FriendList = ({ setModal, onClose }: { setModal: React.Dispatch<React.SetStateAction<string>>, onClose: () => void }) => {
    const { account, friend, setFriend } = accountStore()
    const { list } = chatStore()
    const { setChat } = use(StateContext)
    const handleRemove = (id: string) => {
        friendRemove(id)
            .then((res) => {
                if (res.status === 200) {
                    friend && setFriend(friend.filter((f: Friend) => f._id !== id))
                }
            })
    }
    const handleMessage = (idFriend: string, name: string, avatar: string) => {
        const arrayUser = [account?.idUser, idFriend]
        const checkMessage = list !== null && account && list.filter((f: ChatByUser) => f.user === arrayUser || f.user === arrayUser.reverse())
        if (checkMessage && checkMessage.length > 0) {
            setChat({
                _id: checkMessage[0]._id,
                name: name,
                avatar: avatar,
            })
            onClose()
            return
        } else {
            const data = {
                user: [idFriend],
                type: "individual",
                notification: "",
                created_at: new Date(),
                updated_at: new Date(),
                time: new Date(),
                name: "",
                avatar: "",
            }
            const fetchData = async () => {
                const token = await getToken()
                token && createChat(token, data).then((res) => {
                    if (res.status === 201) {
                        setChat({
                            _id: res.data._id,
                            name: name,
                            avatar: avatar
                        })
                        onClose()
                    }
                })
            }
            fetchData()
        }
    }
    return <ModalContent>
        <ModalHeader>List Friend</ModalHeader>
        <ModalBody>
            <div className='w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-2 gap-2 overflow-auto'>
                {friend && friend.map((f: Friend) => <div key={f._id} className='h-[60px] grid grid-cols-5 border border-solid border-zinc-200 rounded-md hover:bg-zinc-100 transition-all'>
                    <Avatar alt='' src={f.friend.avatar ? f.friend.avatar : ""} radius='sm' size='md' className='col-span-1 m-auto' />
                    <div className='col-span-4'>
                        <p className='px-2 py-1 h-2/4 flex items-center text-sm truncate cursor-pointer'>{f.friend.name}</p>
                        <div className='w-full h-2/4 grid grid-cols-6'>
                            <div
                                onClick={() => handleMessage(f.idUser, f.friend.name, f.friend.avatar)}
                                className='col-span-3 h-6 cursor-pointer text-[14px] rounded-md bg-blue-500 text-white ml-2 flex items-center justify-center'
                            >
                                Send message
                            </div>
                            <div
                                onClick={() => friend && handleRemove(friend.filter((p: any) => p.idUser === f.idUser || p.idFriend === f.idUser)[0]._id)}
                                className='col-span-2 h-6 cursor-pointer text-[14px] rounded-md bg-red-600 text-white ml-2 flex items-center justify-center'>
                                Remove
                            </div>
                        </div>
                    </div>
                </div>)}
            </div>
        </ModalBody>
        <ModalFooter>
            <Button color='danger' onClick={() => { setModal(''), onClose() }}>Close</Button>
        </ModalFooter>
    </ModalContent>
}

export default FriendList