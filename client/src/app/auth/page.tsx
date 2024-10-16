'use client'
import React from 'react'
import SocialLogin from './social'

const Auth = () => {
    return <div className='w-full h-screen text-white flex items-center justify-center'>
        {/* {form === "login" && <Login setForm={setForm} />}
        {form === "register" && <Register setForm={setForm} />} */}
        <SocialLogin />
    </div>
}

export default Auth