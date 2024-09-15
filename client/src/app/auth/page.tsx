'use client'
import React, { useState } from 'react'
import Login from './login'
import Register from './register'

const Auth = () => {
    const [form, setForm] = useState<string>('login')
    return <div className='w-full h-screen text-white flex items-center justify-center'>
        {form === "login" && <Login setForm={setForm} />}
        {form === "register" && <Register setForm={setForm} />}
    </div>
}

export default Auth