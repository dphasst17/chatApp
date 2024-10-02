import { updateUser } from '@/api/account'
import { accountStore } from '@/stores/account'
import { getToken } from '@/utils/cookie'
import { Button, Input, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
interface FormData {
    name: string
    phone: string
    email: string
}
const AccountEdit = ({ onClose, setModal }: {
    onClose: () => void, setModal: React.Dispatch<React.SetStateAction<string>>
}) => {
    const { register, handleSubmit } = useForm<FormData>()
    const { account, setAccount } = accountStore()
    const onSubmit = async (data: FormData) => {
        const changedKeys = (Object.keys(data) as (keyof FormData)[]).filter((key: keyof FormData) => {
            const userKey = key;
            return account && account[userKey] !== data[key];
        });
        const detailData = changedKeys.reduce((acc, key) => {
            return { ...acc, [key]: data[key] };
        }, {});
        const token = await getToken()
        token && updateUser(token, detailData).then(res => {
            if (res.status === 200) {
                account && setAccount({ ...account, ...detailData })
                toast.success(res.message)
                setModal('')
                onClose()
            }
        })
    }
    return <ModalContent>
        <ModalHeader>Edit Account</ModalHeader>
        <ModalBody>
            <div className='w-3/5 h-auto grid grid-cols-1 gap-2 mx-auto'>
                <Input {...register('name', { required: true, minLength: 3 })} placeholder="Name" defaultValue={account?.name} variant='bordered' radius='sm' size="lg" className='my-1' />
                <Input {...register('phone', { required: true, minLength: 10 })} placeholder="Phone" defaultValue={account?.phone} variant='bordered' radius='sm' size="lg" className='my-1' />
                <Input {...register('email', {
                    required: true,
                    pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                })}
                    defaultValue={account?.email} placeholder="Email" variant='bordered' radius='sm' size="lg" className='my-1' />
            </div>
        </ModalBody>
        <ModalFooter>
            <Button color="primary" onClick={handleSubmit(onSubmit)}>Save</Button>
            <Button color="danger" onClick={() => { setModal(''), onClose() }}>Close</Button>
        </ModalFooter>
    </ModalContent>
}

export default AccountEdit