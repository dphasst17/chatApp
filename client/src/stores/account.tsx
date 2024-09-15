'use client'
import { create } from 'zustand'

interface AccountState {
    account: any,
    friend: any,
    setAccount: (account: any[]) => void,
    setFriend: (friend: any[]) => void
}

export const accountStore = create<AccountState>((set) => ({
    account: null,
    friend: null,
    setAccount: (account) => set({ account }),
    setFriend: (friend) => set({ friend }),
}))