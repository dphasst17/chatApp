import { Avatar, Code, Tooltip } from "@nextui-org/react"
import { MessageReply } from "../icon/icon"
interface MessageProps {
    classContent: string
    title: string
    avatar: string
    content: string
    time?: string
    reverse: boolean,
    truncate?: boolean,
    reply?: { id: string, content: string, info: string } | null,
    onClick?: () => void
    handleReply?: () => void
}
const Message = ({ onClick, classContent, title, avatar, content, reverse, truncate, time, reply, handleReply }: MessageProps) => {
    return <div onClick={onClick} className={classContent}>
        <div className={`relative group w-full h-full grid grid-cols-10 gap-1 auto-cols-auto p-1 justify-center effectItem `}>
            {reply && reply.id && <div onClick={handleReply} className={`col-span-10 ${reverse ? 'order-1' : 'order-2'} 
                bg-zinc-500 bg-opacity-50 !text-zinc-700 rounded-md px-1 cursor-pointer`}>
                <p className=' text-sm font-semibold'>Reply {reply.info}</p>
                <div className='w-full h-full max-h-full'
                    dangerouslySetInnerHTML={{ __html: reply.content.includes('<p>') ? reply.content : `<p>[Images]</p>` }}
                />
            </div>}
            <div className={`col-span-1 ${reverse ? 'order-2' : 'order-1'}  flex ${reverse ? 'justify-end' : 'justify-start'} items-center`}>
                <Avatar alt={`avatar-${title}`} src={avatar} size='md' radius="sm" />
            </div>
            <div className={`cursor-pointer col-span-9 ${reverse ? 'order-1' : 'order-2'}`}>
                <Code className="w-full h-auto !text-white bg-white shadow-md">
                    <p className="text-zinc-500 text-[13px]">{title} {time ? `- ${time}` : ''}</p>
                    <p className={`${truncate ? 'truncate' : ''} !text-zinc-900`} dangerouslySetInnerHTML={{ __html: content }} />
                </Code>
            </div>
        </div>
    </div>
}
export const MessageReplyUI = ({ click }: { click: () => void }) => {
    return <Tooltip content="Reply" placement="bottom" showArrow>
        <div className={`w-6 cursor-pointer rounded-md transition-all mx-1 mt-1`}>
            <MessageReply onClick={click} className="w-5 h-5 cursor-pointer" />
        </div>
    </Tooltip>
}

export default Message