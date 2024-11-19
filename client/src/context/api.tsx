'use client'

import { createContext, use, useEffect } from "react";
import { StateContext } from "./state";
import { getFriendByUser, getUser } from "@/api/account";
import { accountStore } from "@/stores/account";
import { getToken } from "@/utils/cookie";
import { getChatList } from "@/api/chat";
import { chatStore } from "@/stores/chat";
import { ChatByUser } from "@/interface/chat";
import { decode } from "@/utils/util";


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
                            setList(res.data.map((c: ChatByUser) => {
                                return {
                                    ...c,
                                    lastMessage: c.lastMessage ?
                                        (c.lastMessage.includes("<p>") ? c.lastMessage : decode(c.lastMessage, process.env.NEXT_PUBLIC_K!))
                                        : null
                                }
                            }))
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