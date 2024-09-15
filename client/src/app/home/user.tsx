'use client'
import UserFriend from '@/components/user/friend'
import UserInfo from '@/components/user/info'
import React from 'react'

const User = () => {
    return <div className='col-span-2 h-[99%] text-white grid grid-cols-1 gap-y-1 items-start'>
        <div className='user h-[15vh]'>
            <UserInfo />
        </div>
        <div className='friend h-[84vh] py-1'>
            <UserFriend />
        </div>
    </div>

}

export default User