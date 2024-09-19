'use client'
import { Account, Friend } from '@/interface/account'
import { create } from 'zustand'

interface AccountState {
    account: Account | null,
    friend: Friend[] | null,
    friendPending: Friend[] | null,
    setAccount: (account: Account | null) => void,
    setFriend: (friend: Friend[] | null) => void,
    setFriendPending: (friendPending: Friend[] | null) => void
}

export const accountStore = create<AccountState>((set) => ({
    account: null,
    friend: null,
    friendPending: null,
    setAccount: (account) => set({ account }),
    setFriend: (friend) => set({ friend }),
    setFriendPending: (friendPending) => set({ friendPending }),
}))