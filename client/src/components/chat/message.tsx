import { Avatar, Code, Modal, Tooltip, useDisclosure } from "@nextui-org/react"
import { MessageReply } from "../icon/icon"
import { StateContext } from "@/context/state"
import { use, useState } from "react"
import { extractImagesAndText } from "@/utils/util"
import ImagesDetail from "../modal/images.detail"
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
    const { mode } = use(StateContext)
    const { text, images } = extractImagesAndText(content);
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [url, setUrl] = useState<string>('')

    return <>
        <div onClick={onClick} className={classContent}>
            <div className={`relative group w-full h-full p-1 flex ${reverse ? 'flex-row-reverse' : 'flex-row'} flex-wrap justify-start items-center effectItem `}>
                {reply && reply.id && <div onClick={handleReply} className={`w-[95%] my-1 bg-zinc-500 bg-opacity-50 ${mode === "light" ? "!text-zinc-700" : "text-zinc-200"} rounded-md px-1 cursor-pointer`}>
                    <p className='text-sm font-semibold'>Reply {reply.info}</p>
                    <p className='w-full h-full max-h-full'
                        dangerouslySetInnerHTML={{ __html: reply.content.includes('<p>') ? reply.content : `<p>[Images]</p>` }}
                    />
                </div>}
                <div className={`w-[30px] ssm:w-[39px] flex ${reverse ? 'justify-end' : 'justify-start'} items-center mx-1`}>
                    <Avatar alt={`avatar-${title}`} src={avatar} size='md' radius="sm" />
                </div>
                <div className={`cursor-pointer w-[75%] sm:w-[85%] md:w-[75%] lg:w-[85%] xl:w-[75%] 2xl:w-[85%]`}>
                    <Code className={`w-full h-auto ${mode === "light" ? "bg-white" : "bg-[#1e1e1e]"} shadow-md my-1`}>
                        <p className={`truncate ${mode === "light" ? "!text-zinc-500" : "!text-zinc-200"} text-[13px]`}>{title} {time ? `- ${time}` : ''}</p>
                        {text && text.length > 0 && (
                            <p
                                className={`${truncate ? "truncate" : "text-wrap"} ${mode === "light" ? "!text-zinc-900" : "!text-zinc-100"
                                    }`}
                                dangerouslySetInnerHTML={{ __html: text }}
                            />
                        )}
                        {images && images.length > 0 &&
                            <div className="max-w-[530px] w-auto h-auto flex flex-wrap justify-between">
                                {
                                    images.map((url, index) => (
                                        <img
                                            key={index}
                                            src={url!}
                                            onClick={() => { setUrl(url!); onOpen() }}
                                            className={`${images.length > 1 ? "w-[49%]" : "w-full"} h-[150px] object-cover cursor-pointer`}
                                            alt=""
                                        />
                                    ))
                                }
                            </div>
                        }
                    </Code>
                </div>
            </div>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" classNames={{ base: '!z-50' }}>
            <ImagesDetail src={url} />
        </Modal>
    </>
}
export const MessageReplyUI = ({ click }: { click: () => void }) => {
    const { mode } = use(StateContext)
    return <Tooltip content="Reply" placement="bottom" showArrow>
        <div className={`w-6 cursor-pointer rounded-md transition-all mx-1 mt-1`}>
            <MessageReply onClick={click} className={`w-5 h-5 cursor-pointer ${mode === "light" ? "text-zinc-500" : "text-zinc-200"}`} />
        </div>
    </Tooltip>
}

export default Message