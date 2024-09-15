'use client'
import { Avatar, Button, Input } from '@nextui-org/react'
import React from 'react'
import { GroupLine, SearchIcon, UserEdit } from '../icon/icon'

const UserInfo = () => {
    return <div className='w-full h-full bg-zinc-950 bg-opacity-70 rounded-md flex flex-wrap justify-around items-center'>
        <Avatar alt='' src="https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png" radius='sm' size='lg' />
        <div className='w-4/5 h-full flex flex-col items-center justify-center'>
            <div className='info w-full grid grid-cols-8 gap-x-2 mb-1'>
                <p className='col-span-6 truncate text-lg font-semibold'>Name</p>
                <UserEdit className='col-span-1 w-8 h-8 bg-zinc-200 rounded-md cursor-pointer' />
                <GroupLine className='col-span-1 w-8 h-8 bg-zinc-200 rounded-md cursor-pointer' />
            </div>
            <div className='icon w-full grid grid-cols-6 gap-x-2'>
                <Input size='sm' type="text" placeholder='Search' className='col-span-4' endContent={<SearchIcon className='w-6 h-6 cursor-pointer  rounded-md' />} />
                <Button color='danger' size="sm" className='col-span-2 text-lg font-bold'>Logout</Button>
            </div>
        </div>
    </div>
}

export default UserInfo