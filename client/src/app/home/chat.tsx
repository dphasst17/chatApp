"use client";
import { getChatImageById, getChatInfoById, getVideoCallById } from "@/api/chat";
import ChatDetail from "@/components/chat/chat";
import ChatInfoDetail from "@/components/chat/chat.info";
import NotificationComponent from "@/components/chat/notification";
import { BackIcon, ChatInfo, VideoCall } from "@/components/icon/icon";
import ModalChatDetail from "@/components/modal/chat.detail";
import { StateContext } from "@/context/state";
import { ChatByUser } from "@/interface/chat";
import { accountStore } from "@/stores/account";
import { chatStore } from "@/stores/chat";
import { getToken } from "@/utils/cookie";
import socket from "@/utils/socket";
import { endCode } from "@/utils/util";
import { Avatar, Badge, Tooltip, useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
const ChatComponent = () => {
  const router = useRouter();
  const { mode, chat, setChat, currentId } = use(StateContext);
  const { account } = accountStore();
  const { list, setList } = chatStore();
  const [dataImage, setDataImage] = useState<{
    total: number;
    read: number;
    data: any[];
  }>({ total: 0, read: 0, data: [] });
  const [info, setInfo] = useState<any>();
  const [isCall, setIsCall] = useState<boolean>(false);
  const [link, setLink] = useState<string>("");
  const [isInfo, setIsInfo] = useState<boolean>(false);
  //
  const { isOpen: openModal, onOpenChange, onClose, onOpen } = useDisclosure();
  const [handle, setHandle] = useState<any>(null);
  const [parameter, setParameter] = useState<any>(null);
  const [contentBtn, setContentBtn] = useState<string>("");
  const [modal, setModal] = useState("");
  //
  const ref = useRef<HTMLDivElement>(null);
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsInfo(false);
    }
  }, []);

  const handleVideoCall = () => {
    const id = uuid();
    const k = process.env.NEXT_PUBLIC_SK!;
    const url = `/room/${id}?role=ch&&l=${endCode(info.user.map((u: any) => u.idUser), k)}`;
    const urlEmit = `/room/${id}?role=u&&l=${endCode(info.user.map((u: any) => u.idUser), k)}`;
    socket.emit("video_call", { idChat: info && info._id, link: urlEmit });
    router.replace(url);
    return;
  };

  useEffect(() => {
    const getData = async () => {
      const token = await getToken();
      getChatInfoById(chat._id).then((res) => {
        res.status === 200 && setInfo(res.data);
      });
      getVideoCallById(chat._id).then((res) => {
        res.status === 200 && res.data && (setIsCall(true), setLink(res.data));
      })
      token &&
        getChatImageById(token, chat._id, 1, 20).then((res) => {
          res.status === 200 &&
            setDataImage({
              total: res.data.total,
              read: res.data.data.length,
              data: res.data.data,
            });
        });
    };
    chat && chat._id !== currentId && getData();
    socket.on("s_g_r_vd_on", (data: { idChat: string; link: string }) => {
      if (info && data.idChat === info._id) {
        data.link ? setIsCall(true) : setIsCall(false);
        setLink(data.link);
      }
    });
    socket.on(
      "s_g_r_chat_info",
      (data: {
        idChat: string;
        data: { [key: string]: string | number | boolean | [] | any[] | any };
      }) => {
        chat &&
          chat._id === data.idChat &&
          (setChat({
            ...chat,
            ...data.data,
          }),
            setInfo({ ...info, ...data.data }));
        list &&
          setList(
            list.map((c: ChatByUser) =>
              c._id === data.idChat ? { ...c, ...data.data } : c,
            ),
          );
      },
    );
  }, [chat, currentId, list]);
  useEffect(() => {
    !openModal && document.addEventListener("mousedown", handleClickOutside);
    return () => {
      !openModal && document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [])
  const handleLoadMoreImage = async () => {
    const token = await getToken();
    const unread = dataImage.total - dataImage.read;
    const nextPage = Math.ceil(dataImage.read / 20) + 1;
    unread !== 0 &&
      getChatImageById(token, chat._id, nextPage, 20).then((res) => {
        res.status === 200 &&
          setDataImage({
            total: dataImage.total,
            read: dataImage.read + res.data.data.length,
            data: [...dataImage.data, ...res.data.data],
          });
      });
  };
  return (
    <div
      className={`fixed md:relative md:z-50 w-screen md:w-auto top-0 left-0 md:bg-transparent ${mode === "dark" ? "bg-black" : "bg-white"} shadow-none md:shadow-2xl
        ${chat ? "translate-x-0" : "translate-x-[100%] md:translate-x-0"}
        col-span-0 md:col-span-5 xl:col-span-6 h-dvh md:h-[99vh] rounded-none md:rounded-md text-red-500 overflow-x-hidden transition-all`}
    >
      <div className="relative w-full h-full rounded-md flex flex-col justify-between p-1">
        {chat ? (
          <>
            <section className={`w-full h-[10%] sm:h-[4%] min-h-[80px] grid grid-rows-1 grid-cols-10 rounded-md ${mode === "dark" ? "bg-zinc-800" : "bg-zinc-200"}`}>
              <div className="col-span-1 h-full flex items-center justify-around">
                <BackIcon
                  className="w-8 h-8 lg:w-10 lg:h-10 block md:hidden cursor-pointer"
                  onClick={() => setChat(null)}
                />
                <div className="avatar hidden sm:block"><Avatar radius="sm" alt="avatar" src={chat.avatar} size="md" /></div>
              </div>
              <div className="col-span-9 h-full grid grid-cols-6 items-center">
                {/* Chat Name */}
                <div className="col-span-2 sm:col-span-5 md:col-span-3 xl:col-span-5  h-2/4 sm:h-full flex justify-start items-center truncate text-xl font-bold">
                  <span className={`truncate ${mode === "light" ? "text-zinc-900" : "text-zinc-200"}`}>{chat.name}</span>
                </div>
                {/* Icon */}
                <div className="col-span-4 sm:col-span-1 md:col-span-3 xl:col-span-1 h-2/4 sm:h-full flex items-center justify-evenly">
                  {info && info.type === "group" && <NotificationComponent idChat={chat._id} />}
                  <div className="w-10 h-10">
                    {isCall ? (
                      <Badge color="success" content="">
                        <VideoCall
                          className="w-8 h-8 lg:w-10 lg:h-10 mx-1 cursor-pointer text-green-500"
                          onClick={() => router.replace(link + `&i=${endCode(account?.idUser as string, process.env.NEXT_PUBLIC_SK!)}`)}
                        />
                      </Badge>
                    ) : (
                      <VideoCall
                        className="w-8 h-8 lg:w-10 lg:h-10 mx-1 cursor-pointer"
                        onClick={handleVideoCall}
                      />
                    )}
                  </div>
                  <Tooltip
                    placement="left-start"
                    isOpen={isInfo}
                    offset={-30}
                    crossOffset={100}
                    color="default"
                    classNames={{ base: "!z-30", content: "relative p-0 !z-30" }}
                    content={
                      <ChatInfoDetail
                        info={info}
                        dataImage={dataImage}
                        handleLoadMoreImage={handleLoadMoreImage}
                        setIsOpen={setIsInfo}
                        onClose={onClose}
                        onOpen={onOpen}
                        setHandle={setHandle} setModal={setModal} setParameter={setParameter} setContentBtn={setContentBtn}
                      />
                    }
                  >
                    <div ref={ref} className="w-8 h-8 lg:w-10 lg:h-10 mx-1">
                      <ChatInfo
                        className="w-8 h-8 lg:w-10 lg:h-10 cursor-pointer"
                        onClick={() => setIsInfo(!isInfo)}
                      />
                    </div>
                  </Tooltip>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="w-full h-[4%] min-h-[80px]"></section>
        )
        }
        <ChatDetail info={info} />
      </div >
      <ModalChatDetail
        isOpen={openModal}
        onOpenChange={onOpenChange}
        onClose={onClose}
        modal={modal}
        handle={handle}
        parameter={parameter}
        contentBtn={contentBtn}
        handleChangeMember={setModal}
        setModal={setModal}
        setHandle={setHandle}
      />
    </div >
  );
};

export default ChatComponent;
