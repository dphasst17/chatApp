'use client'
import { get } from "@/utils/cookie";
import { createContext, useEffect, useState } from "react";

export const StateContext = createContext<any>({});
export const StateProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLog, setIsLog] = useState<boolean>(false)
    useEffect(() => {
        setIsLog(JSON.parse(get('c-log') || 'false'))
    }, [])
    return (
        <StateContext.Provider value={{
            isLog, setIsLog,
        }}>
            {children}
        </StateContext.Provider>
    )
}