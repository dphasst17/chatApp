'use client'
import { createChat, uploadImages } from '@/api/chat'
import ListChat from '@/components/user/chat'
import UserInfo from '@/components/user/info'
import { Friend } from '@/interface/account'
import { accountStore } from '@/stores/account'
import { getToken } from '@/utils/cookie'
import socket from '@/utils/socket'
import { Avatar, Button, Checkbox, CheckboxGroup, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, User } from '@nextui-org/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

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
const ModalCreateGroup = ({ onClose }: { onClose: () => void }) => {
    const { account } = accountStore()
    const { register, handleSubmit } = useForm()
    const { friend } = accountStore()
    const [isSelected, setIsSelected] = useState<string[]>([])
    const [avatar, setAvatar] = useState<File[] | null>(null)
    const onSubmit: any = async (data: { name: string }) => {
        const dataGroup = {
            name: data.name,
            user: [...isSelected],
            avatar: avatar ? `${process.env.NEXT_PUBLIC_S3}/user/${avatar[0].name}` : '',
            created_at: new Date(),
            updated_at: new Date(),
            time: new Date(),
            notification: `${account?.name} has created group`,
            type: "group"
        }
        const dataImages = new FormData()
        avatar && avatar.forEach((f: File) => dataImages.append('files', f))
        const token = await getToken()
        uploadImages(dataImages, 'user')
            .then(res => {
                if (res.status === 201) {
                    //create group
                    createChat(token, dataGroup).then((res) => {
                        if (res.status === 201) {
                            socket.emit('u_create_group', {
                                ...res.data,
                                lastMessage: res.data.notification
                            })
                            onClose()
                        }
                    })
                }
            })
    }
    return <ModalContent>
        <ModalHeader>Create group</ModalHeader>
        <ModalBody>
            <div className='w-full h-full grid grid-cols-4 gap-2'>
                <Input {...register('name')} placeholder="Group name" radius="sm" className='col-span-4' />
                <label htmlFor="uploadFile1"
                    className="col-span-4 mt-1 flex items-center bg-gray-800 hover:bg-gray-700 text-white text-base px-5 py-1 outline-none rounded w-max cursor-pointer mx-auto font-[sans-serif]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 mr-2 fill-white inline" viewBox="0 0 32 32">
                        <path
                            d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                            data-original="#000000" />
                        <path
                            d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                            data-original="#000000" />
                    </svg>
                    Upload
                    <input type="file" id='uploadFile1' onChange={(e) => setAvatar(Array.from(e.target.files!))} className="hidden" />
                </label>
                <p className='col-span-4 font-bold'>Avatar preview</p>
                {avatar && <img src={URL.createObjectURL(avatar[0])} className='w-40 h-40 col-span-4 mx-auto rounded-md cursor-pointer object-cover' />}
                <p className='col-span-4 font-bold'>Add member</p>
                <CheckboxGroup
                    onChange={setIsSelected}
                    value={isSelected}
                    classNames={{
                        wrapper: ["w-full h-auto grid grid-cols-3 gap-2"],
                    }}
                    className='col-span-4 h-auto'>
                    {friend && friend.map((f: Friend) => <Checkbox key={f._id}
                        aria-label={f.friend.name}
                        classNames={{
                            base: ["my-1 inline-flex w-full max-w-md bg-content1",
                                "hover:bg-content2 items-center justify-start",
                                "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                                "data-[selected=true]:border-primary",],
                        }}
                        value={f.friend.idUser}
                    >
                        <div className="flex justify-between gap-2">
                            <User
                                avatarProps={{ size: "md", src: f.friend.avatar }}
                                name={f.friend.name}
                            />
                            {/* <div className="flex flex-col items-end gap-1">

                                <Chip color="success" size="sm" variant="flat">
                                    {f.friend.online}
                                </Chip>
                            </div> */}
                        </div>
                    </Checkbox>)}
                </CheckboxGroup>
            </div>
        </ModalBody>
        <ModalFooter>
            <Button color="primary" onClick={handleSubmit(onSubmit)}>Create</Button>
            <Button color="danger" onClick={onClose}>Close</Button>
        </ModalFooter>
    </ModalContent>
}

export default UserComponent