'use client'

import { createContext, use, useEffect } from "react";
import { StateContext } from "./state";
import { getFriendByUser, getUser } from "@/api/account";
import { accountStore } from "@/stores/account";
import { getToken } from "@/utils/cookie";
import { getChatList } from "@/api/chat";
import { chatStore } from "@/stores/chat";


export const ApiContext = createContext<any>({});
export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
    const { isLog } = use(StateContext)
    const { setList } = chatStore()
    const { setAccount, setFriendPending, setFriend } = accountStore()
    useEffect(() => {
        const fectDataUser = async () => {
            const token = await getToken()
            token && (
                getUser(token)
                    .then(res => {
                        if (res.status === 200) {
                            setAccount(res.data)
                        }
                    }),
                getFriendByUser(token, "pending")
                    .then(res => {
                        if (res.status === 200) {
                            setFriendPending(res.data)

                        }
                    }),
                getFriendByUser(token, "accepted")
                    .then(res => {
                        if (res.status === 200) {
                            setFriend(res.data)
                        }
                    }),
                getChatList(token)
                    .then(res => {
                        if (res.status === 200) {
                            setList(res.data)
                        }
                    })
            )
        }
        isLog && fectDataUser()
    }, [isLog])
    return (
        <ApiContext.Provider value={{}}>
            {children}
        </ApiContext.Provider>
    )
}