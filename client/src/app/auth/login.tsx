'use client'
import { login } from '@/api/auth'
import { StateContext } from '@/context/state'
import { save } from '@/utils/cookie'
import { Button, Input } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React, { use, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
interface LoginData {
    username: string
    password: string
}
const Login = ({ setForm }: { setForm: React.Dispatch<React.SetStateAction<string>> }) => {
    const { setIsLog } = use(StateContext)
    const { register, handleSubmit } = useForm()
    const [isShow, setIsShow] = useState<boolean>(false)
    const router = useRouter()
    const onSubmit: any = (data: LoginData) => {
        login(data.username, data.password).then((res) => {
            if (res.status === 200) {
                toast.success("Login success")
                setIsLog(true)
                save('c-atk', res.data.a, res.data.ea)
                save('c-rtk', res.data.r, res.data.er)
                save('c-log', 'true', res.data.er)
                router.push('/')
            }
            else {
                toast.error(res.message)
            }
        })
    }
    return <div className='xl:w-[300px] 2xl:w-[400px] xl:h-[500px] 2xl:h-[600px] rounded-md px-1'>
        <div className='w-full h-[60px] flex items-center justify-center text-5xl font-bold'>Sign In</div>
        <p className='text-center mb-8'>Enter your username and password</p>
        <Input {...register('username', { required: true })} placeholder="Username" variant='bordered' radius='sm' size="lg" className='my-4' />
        <Input {...register('password', { required: true })} type={isShow ? 'text' : 'password'} placeholder="Password" variant='bordered' radius='sm' size="lg" className='my-4' />
        <Button onClick={handleSubmit(onSubmit)} radius='sm' className='w-full mt-4 text-xl bg-zinc-900 text-white'>Sign In</Button>
        <div className='w-full h-[60px] mt-4 flex justify-between'>
            <div className='cursor-pointer transition-all' onClick={() => setIsShow(!isShow)}>{isShow ? 'Hide' : 'Show'} password</div>
            <p className='cursor-pointer'>Forgot password ?</p>
        </div>
        <hr className='mt-4 mb-2' />
        <div className='w-full h-[60px] flex items-center justify-center'>
            Not registered ? <span onClick={() => setForm('register')} className='font-semibold hover:text-blue-500 transition-all cursor-pointer ml-2'>Create account</span>
        </div>
    </div>
}

export default Login