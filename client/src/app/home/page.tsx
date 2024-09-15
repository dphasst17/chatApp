import React from 'react'
import User from './user'
import Chat from './chat'

const Home = () => {
    return <div className='w-full h-screen overflow-hidden grid grid-cols-8 gap-2 py-1 px-2'>
        <User />
        <Chat />
    </div>
}

export default Home