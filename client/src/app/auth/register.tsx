'use client'
import { registerAuth } from '@/api/auth'
import { Button, Input } from '@nextui-org/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

interface RegisterData {
    username: string
    password: string
    confirm: string
    name: string
    email: string
}
const Register = ({ setForm }: { setForm: React.Dispatch<React.SetStateAction<string>> }) => {
    const { register, handleSubmit } = useForm<RegisterData>()
    const [isShow, setIsShow] = useState<boolean>(false)
    const onSubmit: any = (data: RegisterData) => {
        if (data.password !== data.confirm) {
            toast.error("Confrim password does not match with password")
            return
        }
        const dataAccount = {
            username: data.username,
            password: data.password,
            name: data.name,
            email: data.email
        }
        registerAuth(dataAccount)
            .then((res) => {
                if (res.status === 201) {
                    toast.success("Register success")
                    setForm('login')
                }
                else {
                    toast.error(res.message)
                }
            })
    }
    return <div className='xl:w-[300px] 2xl:w-[400px] xl:h-[500px] 2xl:h-[600px] rounded-md px-1'>
        <div className='w-full h-[60px] flex items-center justify-center text-5xl font-bold'>Join us today</div>
        <Input {...register('username', { required: true })} placeholder="Username" variant='bordered' radius='sm' size="lg" className='my-4' />
        <Input {...register('password', { required: true })} type={isShow ? 'text' : 'password'} placeholder="Password" variant='bordered' radius='sm' size="lg" className='my-4' />
        <Input {...register('confirm', { required: true })} type={isShow ? 'text' : 'password'} placeholder="Confirm Password" variant='bordered' radius='sm' size="lg" className='my-4' />
        <Input {...register('email', { required: true })} placeholder="Email" variant='bordered' radius='sm' size="lg" className='my-4' />
        <Input {...register('name', { required: true })} placeholder="Name" variant='bordered' radius='sm' size="lg" className='my-4' />
        <Button onClick={handleSubmit(onSubmit)} radius='sm' className='w-full mt-4 text-xl bg-zinc-900 text-white'>Create account</Button>
        <div className='w-full h-[60px] mt-4 flex justify-between'>
            <div className='cursor-pointer transition-all' onClick={() => setIsShow(!isShow)}>{isShow ? 'Hide' : 'Show'} password</div>
            <p className='cursor-pointer'>Forgot password ?</p>
        </div>
        <hr className='mt-4 mb-2' />
        <div className='w-full h-[60px] flex items-center justify-center'>
            Already have an account? <span onClick={() => setForm('login')} className='font-semibold hover:text-blue-500 transition-all cursor-pointer ml-2'>Sign In</span>
        </div>
    </div>
}

export default Register