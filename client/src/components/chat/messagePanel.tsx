import React from 'react'
import { CloseIcon, EmojiIcon, FileIcon, ImageIcon, MessageUpload, TagMore } from '../icon/icon'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { Button, Input } from '@nextui-org/react'

const MessagePanel = ({ reply, setReply, value, setValue, onEmojiClick, handleUploadImage, handleSendMessage }
    : {
        reply: {
            id: string;
            name: string;
            content: string;
            time: any;
        } | null,
        setReply: React.Dispatch<React.SetStateAction<{
            id: string;
            name: string;
            content: string;
            time: any;
        } | null>>,
        value: string,
        setValue: React.Dispatch<React.SetStateAction<string>>,
        onEmojiClick?: (event: EmojiClickData) => void,
        handleUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void,
        handleSendMessage: () => void
    },
) => {
    const [showPicker, setShowPicker] = React.useState<boolean>(false)
    return <div className={`message-input w-full ${!reply ? "h-[8%]" : "h-[15%]"} max-h-[15%] grid grid-cols-12 grid-rows-7 gap-1 pt-2 transition-all`}>
        {reply && (
            <div className="relative bg-zinc-500 bg-opacity-70 col-span-12 row-span-3 h-full p-1 rounded-md overflow-hidden">
                <CloseIcon onClick={() => setReply(null)} className="absolute top-1 right-1 w-5 h-5 cursor-pointer" />
                <p className="text-zinc-100 text-sm font-semibold">
                    Reply {reply.name} - {reply.time}
                </p>
                <div className="w-full h-full max-h-full text-zinc-100" dangerouslySetInnerHTML={{
                    __html: reply.content.includes("<p>")
                        ? reply.content
                        : `<p>[Images]</p>`,
                }}
                />
            </div>
        )}
        <div className={`col-span-5 xl:col-span-2 rounded-md ${reply ? "row-span-4" : "row-span-7"} flex justify-evenly items-center border border-solid border-zinc-400`}>
            <EmojiIcon onClick={() => setShowPicker(!showPicker)} className="w-7 h-7 cursor-pointer" />
            {
                <label>
                    <ImageIcon className="w-7 h-7 cursor-pointer" />
                    <input
                        multiple onChange={(e) => handleUploadImage(e)}
                        type="file" accept="image/*" className="hidden"
                    />
                </label>
            }
            <FileIcon className="w-6 h-6 cursor-pointer" />
            <TagMore className="w-7 h-7 cursor-pointer" />
        </div>
        {showPicker && (
            <EmojiPicker style={{ position: "absolute", bottom: "60px", left: "0" }} onEmojiClick={onEmojiClick} />
        )}
        <div className={`col-span-7 xl:col-span-10 ${reply ? "row-span-4" : "row-span-7"}`}>
            <Input
                placeholder="Message..."
                endContent={
                    <Button isIconOnly className="h-full rounded-md text-white bg-zinc-950 px-1" onClick={handleSendMessage}>
                        <MessageUpload className="w-7 h-7 " />
                    </Button>
                }
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                radius="sm"
                type="text"
                classNames={{
                    inputWrapper: "w-full h-full rounded-md text-white px-1 border border-solid border-zinc-400 p-1",
                    base: `w-full h-[99%]`,
                }}
                className="text-white px-1"
            />
        </div>
    </div>
}

export default MessagePanel;