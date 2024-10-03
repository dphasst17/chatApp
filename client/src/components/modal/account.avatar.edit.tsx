import { updateUser } from '@/api/account'
import { uploadImages } from '@/api/chat'
import { accountStore } from '@/stores/account'
import { getToken } from '@/utils/cookie'
import { Avatar, Button, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const AvatarEdit = ({ onClose, setModal }: {
    onClose: () => void, setModal: React.Dispatch<React.SetStateAction<string>>
}) => {
    const { account, setAccount } = accountStore()
    const [data, setData] = useState<File | null>(null)
    const handleUpload = async () => {
        if (!data) return
        if (data.size > 1048576) {
            toast.error('File too large')
            return
        }
        const dataUpdate = {
            avatar: `${process.env.NEXT_PUBLIC_S3}/user/${data.name}`
        }
        const dataImage = new FormData()
        dataImage.append('files', data)
        const token = await getToken()
        const isUpload = await uploadImages(dataImage, 'user')
        if (!isUpload) return
        token && updateUser(token, dataUpdate).then(res => {
            if (res.status === 200) {
                account && setAccount({ ...account, ...dataUpdate })
                setModal('')
                onClose()
            }
        })
    }
    return account && <ModalContent>
        <ModalHeader>Upload Avatar</ModalHeader>
        <ModalBody>
            <div className='w-4/5 h-full min-h-[15vh] mx-auto grid grid-cols-6 gap-2'>
                <div className='col-span-2 h-full'>
                    <Avatar radius='sm' alt="Avatar" src={data ? URL.createObjectURL(data) : account.avatar} className='w-full h-full' />
                </div>
                <div className='col-span-4 h-full flex flex-col justify-center items-center'>
                    <div>{data && `${data.name} - ${data.size} bytes`}</div>
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
                        Choose file to upload
                        <input type="file" id='uploadFile1' onChange={(e) => setData(e.target.files ? e.target.files[0] : null)} className="hidden" />
                    </label>
                </div>
            </div>
        </ModalBody>
        <ModalFooter>
            <Button size="sm" radius='sm' color="primary" onClick={handleUpload}>Upload</Button>
            <Button size="sm" radius='sm' color="danger" onClick={() => { setModal(''), onClose() }}>Close</Button>
        </ModalFooter>
    </ModalContent>
}

export default AvatarEdit