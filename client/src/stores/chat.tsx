'use client'
import { ChatByUser } from '@/interface/chat'
import { create } from 'zustand'

interface ChatState {
    list: ChatByUser[] | null
    setList: (list: ChatByUser[]) => void
}

export const chatStore = create<ChatState>((set) => ({
    list: null,
    setList: (list) => set({ list }),
}))