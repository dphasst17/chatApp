import { Chat } from '@/interface/chat'
import React, { use, useEffect, useState } from 'react'
import Message, { MessageReplyUI } from './message'
import { convertDataChat, decode, formatDate, isToday } from '@/utils/util'
import { Tooltip } from '@nextui-org/react'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { ReactionIcon } from '../icon/icon'
import { StateContext } from '@/context/state'
import { Account } from '@/interface/account'

const ChatContentDetail = ({ props, account, handleScrollReply, handleReaction, reply, setReply }:
    {
        props: Chat[], account: Account,
        handleScrollReply: (id: string) => void, handleReaction: (emoji: EmojiClickData, id: string, arrayEmoji?: any[]) => void,
        reply: any, setReply: any
    }) => {
    const { mode } = use(StateContext)
    const [result, setResult] = useState<{ date: string, data: Chat[] }[] | null>()
    useEffect(() => {
        setResult(convertDataChat(props))
    }, [props])
    return <>
        {
            result && result.map((d: { date: string, data: Chat[] }) => <div key={d.date} className='w-full h-auto'>
                <div className={`w-full h-[40px] flex justify-center items-center my-1 ${mode === "light" ? "text-zinc-900" : "text-zinc-100"}`}>{isToday(d.date)}</div>
                {d.data.map((c: Chat) => <div key={c._id} id={c._id} className={`relative w-full h-auto my-6 flex ${c.sender === account.idUser ? "justify-end" : "justify-start"}`}>
                    <div className="w-auto max-w-[70%] min-w-[325px] h-auto min-h-[20px]">
                        <Message
                            reverse={c.sender === account.idUser}
                            classContent={`w-full h-auto min-h-[20px] ${reply && reply.id === c._id ? "bg-blue-700 bg-opacity-30" : ""} rounded-md transition-all mb-4`}
                            title={c.sender === account.idUser ? "You" : c.name!}
                            avatar={
                                c.sender === account.idUser ? account.avatar : c.avatar!
                            }
                            content={decode(c.message, process.env.NEXT_PUBLIC_K as string)}
                            time={`${formatDate(c.time)}`}
                            reply={{
                                id: c.replyId!,
                                content: c.replyContent!,
                                info: c.replyInfo!,
                            }}
                            handleReply={() => handleScrollReply(c.replyId!)}
                        />
                        <div className={`block absolute -bottom-1 ${c.sender === account.idUser ? "right-12" : "left-12"} flex justify-start items-center`}>
                            {c.sender === account.idUser && (
                                <MessageReplyUI
                                    click={() =>
                                        setReply({
                                            id: c._id!,
                                            content: c.message,
                                            name: c.name!,
                                            time: `${formatDate(c.time)} - ${isToday(c.date!)}`,
                                        })
                                    }
                                />
                            )}
                            {c.emoji
                                .map((e: any) => e.idUser)
                                .filter((e: any) => e.includes(account.idUser)).length ===
                                0 ? (
                                <>
                                    <Tooltip
                                        placement={c.sender === account.idUser ? "top-end" : "top-start"}
                                        content={
                                            <EmojiPicker
                                                reactions={[
                                                    "2764-fe0f",
                                                    "1f44d",
                                                    "1f44e",
                                                    "1f621",
                                                    "1f604",
                                                    "1f622",
                                                    "1f44c",
                                                    "1f44b",
                                                ]}
                                                reactionsDefaultOpen={true}
                                                onReactionClick={(e: EmojiClickData) =>
                                                    handleReaction(e, c._id as string, c.emoji)
                                                }
                                            />
                                        }
                                    >
                                        <div className={`w-6 cursor-pointer rounded-md transition-all`}>
                                            <ReactionIcon className={`w-6 h-6 mx-auto ${mode === "light" ? "text-zinc-900" : "text-zinc-100"}`} />
                                        </div>
                                    </Tooltip>
                                    <div className={`${c.emoji.length > 0 ? "block" : "hidden"} w-6 flex justify-around items-center cursor-pointer rounded-md bg-zinc-500 transition-all`}>
                                        {c.emoji.map((e: any) => e.emoji)}
                                    </div>
                                </>
                            ) : (
                                <div className={`w-auto flex justify-around items-center cursor-pointer rounded-md bg-zinc-500 transition-all`}>
                                    {new Set(c.emoji.map((e: any) => e.emoji))}
                                </div>
                            )}
                            {c.sender !== account.idUser && (
                                <MessageReplyUI click={() => setReply({ id: c._id!, content: c.message, name: c.name!, time: `${formatDate(c.time)} - ${isToday(c.date!)}` })} />
                            )}
                        </div>
                    </div>
                </div>)}
            </div>)
        }

    </>
}

export default ChatContentDetail