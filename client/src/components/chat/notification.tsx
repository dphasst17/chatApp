import { getNotiById } from '@/api/chat'
import { Tooltip } from '@nextui-org/react'
import React, { use, useEffect, useRef, useState } from 'react'
import { NotificationIcon } from '../icon/icon'
import { formatDate } from '@/utils/util'
import { Notification } from '@/interface/chat'
import { StateContext } from '@/context/state'
import socket from '@/utils/socket'

const NotificationComponent = ({ idChat }: { idChat: string }) => {
    const [data, setData] = useState<any>()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const ref = useRef<HTMLDivElement>(null);
    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };
    useEffect(() => {
        getNotiById(idChat)
            .then((res) => {
                res.status === 200 && setData(res.data)
            })
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    useEffect(() => {
        socket.on('s_g_r_notification', (value: any) => {
            data && value.idChat === idChat && setData({ total: data.total + 1, data: [value.detail, ...data.data] })
        })
        return () => {
            socket.off('s_g_r_noti')
        }
    }, [data])
    return data && <Tooltip
        isOpen={isOpen}
        placement="left-start"
        offset={-20}
        crossOffset={100}
        color="default"
        classNames={{ base: "!z-30", content: "relative p-0 !z-30" }}
        content={<NotiContent data={data} />}
    >
        <div ref={ref} className='w-10 h-10 flex justify-center items-center'>
            <NotificationIcon
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 cursor-pointer"
            />
        </div>
    </Tooltip>
}
const NotiContent = ({ data }: { data: { total: number, data: Notification[] } | null }) => {
    const { mode } = use(StateContext)
    return <div className={`w-[300px] h-[240px] ${mode === "light" ? "bg-white text-[#1e1e1e]" : "bg-[#1e1e1e] text-zinc-50"} rounded-md`}>
        <div className='w-full h-[40px] flex justify-center items-center my-1'>Notification</div>
        <div className='w-full h-[160px] overflow-y-auto'>
            {data && data.data.map((item: Notification) => <div key={item._id} className='w-full h-[40px] flex justify-around items-center my-1'>
                <span>{formatDate(item.date)}</span>
                <span>{item.notification.replace('${actorId}', item.actorName! ?? "Owner").replace('${targetId}', item.targetName!)}</span>
            </div>)}
        </div>
        {data && data.data.length === 0 && <div className='w-full h-[40px] flex justify-center items-center my-1'>No Notification</div>}
        {data && data.data.length < data.total && <div className='w-full h-[40px] flex justify-center items-center my-1'>See more</div>}
    </div>
}
export default NotificationComponent