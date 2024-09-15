import { Avatar, Code } from "@nextui-org/react"

interface MessageProps {
    classContent: string
    title: string
    avatar: string
    content: string
    time?: string
    reverse: boolean,
    truncate?: boolean,
    online?: boolean
}
const Message = ({ classContent, title, avatar, content, time, reverse, truncate, online }: MessageProps) => {
    return <div className={classContent}>
        <div className={`w-full h-full grid grid-cols-12 p-1 justify-center`}>
            <div className={`col-span-2 ${reverse ? 'order-2' : 'order-1'} flex justify-center items-center`}>
                <Avatar isBordered color={online ? 'success' : 'default'} alt={`avatar-${title}`} src={avatar} size='md' radius="sm" />
            </div>
            <div className={`cursor-pointer col-span-10 ${reverse ? 'order-1' : 'order-2'}`}>
                <Code className="w-full h-full !text-white">
                    <p>{title}</p>
                    <p className={`${truncate ? 'truncate' : ''}`}>{content}</p>
                </Code>
            </div>
        </div>
    </div>
}

export default Message