'use client'
import { ChatDetailInfo } from "@/interface/chat";
import { get } from "@/utils/cookie";
import { createContext, useEffect, useState } from "react";

export const StateContext = createContext<any>({});
export const StateProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLog, setIsLog] = useState<boolean>(false)
    const [chat, setChat] = useState<ChatDetailInfo | null>(null)
    const [currentId, setCurrentId] = useState<string>('')
    const [allowUser, setAllowUser] = useState<any[]>([])
    const [mode, setMode] = useState<string>("light")
    useEffect(() => {
        setIsLog(JSON.parse(get('c-log') || 'false'))
        setMode(localStorage.getItem('mode') || 'light')
    }, [])
    return (
        <StateContext.Provider value={{
            isLog, setIsLog,
            chat, setChat,
            currentId, setCurrentId,
            allowUser, setAllowUser,
            mode, setMode
        }}>
            {children}
        </StateContext.Provider>
    )
}