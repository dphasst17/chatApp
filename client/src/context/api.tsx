'use client'

import { createContext, use, useEffect } from "react";
import { StateContext } from "./state";
import { getToken } from "@/utils/cookie";
import { useFetch } from "@/hooks/useFetchData";
import { getUser } from "@/api/account";


export const ApiContext = createContext<any>({});
export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
    const { isLog } = use(StateContext)
    const { data: userData, error: userError } = useFetch(getUser, null, true)
    useEffect(() => {
        userData && isLog && console.log(userData)
    }, [userData, isLog])
    return (
        <ApiContext.Provider value={{}}>
            {children}
        </ApiContext.Provider>
    )
}