import React from 'react'
import Message from '../chat/message'

const UserFriend = () => {
    return <div className='w-full h-full bg-zinc-950 bg-opacity-70 rounded-md'>
        <div className='w-[95%] h-full py-2 overflow-y-auto'>
            <Message classContent="w-full h-[20px]" title="Friend" avatar="https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg"
                content="Name" time="12:00" reverse={false} />
        </div>
    </div>
}

export default UserFriend