import { Avatar, Code } from "@nextui-org/react"
interface MessageProps {
    classContent: string
    title: string
    avatar: string
    content: string
    time?: string
    reverse: boolean,
    truncate?: boolean,
    onClick?: () => void
}
const Message = ({ onClick, classContent, title, avatar, content, reverse, truncate, time }: MessageProps) => {
    return <div onClick={onClick} className={classContent}>
        <div className={`relative group w-full h-full grid grid-cols-10 gap-1 p-1 justify-center effectItem `}>
            <div className={`col-span-1 ${reverse ? 'order-2' : 'order-1'} flex justify-center items-center`}>
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

export default Message