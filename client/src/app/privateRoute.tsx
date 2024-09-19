'use client'
import { StateContext } from '@/context/state'
import { useRouter } from 'next/navigation'
import React, { use, useEffect } from 'react'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { isLog } = use(StateContext)
    const router = useRouter()
    useEffect(() => {
        if (!isLog) {
            router.push('/auth')
        }
        else {
            router.push('/')
        }
    }, [isLog])

    return children
}

export default PrivateRoute