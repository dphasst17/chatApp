import { getChatById, insertChat, updateChat, insertImages, uploadImages } from "@/api/chat";
import React, { use, useEffect, useRef, useState } from "react";
import { EmojiClickData } from "emoji-picker-react";
import { Chat, ChatByUser } from "@/interface/chat";
import { StateContext } from "@/context/state";
import { accountStore } from "@/stores/account";
import { getToken } from "@/utils/cookie";
import { decode, endCode, renameImageFile } from "@/utils/util";
import { chatStore } from "@/stores/chat";
import { toast } from "react-toastify";
import socket from "@/utils/socket";
import EmptyChat from "./emptyChat";
import EmptyMessage from "./emptyMessage";
import MessagePanel from "./messagePanel";
import ChatContentDetail from "./chatContentDetail";
const ChatDetail = ({ info }: { info: any }) => {
  const { chat, currentId, setCurrentId } = use(StateContext);
  const { account } = accountStore();
  const { list, setList } = chatStore();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [data, setData] = useState<Chat[] | null>(null);
  const [reply, setReply] = useState<{
    id: string;
    name: string;
    content: string;
    time: any;
  } | null>(null);
  const [count, setCount] = useState<{
    total: number;
    totalPage: number;
    read: number;
  }>({ total: 0, totalPage: 0, read: 0 });
  const [value, setValue] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFetchChat = async (
    firstFetch: boolean,
    data?: Chat[],
    page?: number,
    limit?: number,
  ) => {
    setReply(null);
    setIsPending(true);
    setData(null);
    const token = await getToken();
    getChatById(token, chat._id, page || 1, limit || 20).then((res) => {
      setIsPending(false);
      firstFetch && res.status === 200 && setData(res.data.data);
      !firstFetch &&
        data &&
        res.status === 200 &&
        setData([...res.data.data, ...data]);
      firstFetch &&
        res.status === 200 &&
        setCount({
          total: res.data.total,
          totalPage: Math.ceil(res.data.total / 5),
          read: res.data.data.length,
        });
      res.status !== 200 && setData([]);
      firstFetch && setCurrentId(chat._id);
    });
  };
  useEffect(() => {
    chat && chat._id !== currentId && handleFetchChat(true);
    setTimeout(() => {
      scrollToBottom();
    }, 150);
  }, [chat, currentId]);
  const onEmojiClick = (emojiData: EmojiClickData) => {
    setValue((prevInput) => prevInput + emojiData.emoji);
  };
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arrFile = Array.from(e.target.files!);
    if (arrFile.length === 0) return;
    const renamedFiles = arrFile.map((file) => {
      return renameImageFile(file);
    });
    const dataImages = new FormData();
    for (let i = 0; i < renamedFiles.length; i++) {
      dataImages.append("files", renamedFiles[i]);
    }
    const messageData = `<div class="w-[530xp] h-auto flex flex-wrap justify-between">${renamedFiles.map((f: any) =>
      `<img class="${renamedFiles.length >= 2 ? "w-[49%] h-[150px] object-cover" : ""} ${renamedFiles.length === 1 ? "w-full h-[300px] object-cover" : ""}"
            src="${process.env.NEXT_PUBLIC_S3}/chat/${f.name}" />`,).join("")}</div>`
    uploadImages(dataImages).then((res) => {
      if (res.status === 201) {
        const dataMessage = {
          message: endCode(messageData, process.env.NEXT_PUBLIC_K!),
          date: new Date(),
          time: new Date().toLocaleTimeString(),
          emoji: [],
          status: "sent",
        };
        const insertData = async () => {
          const token = await getToken();
          account &&
            token &&
            insertImages(token, chat._id, {
              images: renamedFiles.map(
                (f: any) => `${process.env.NEXT_PUBLIC_S3}/chat/${f.name}`,
              ),
              name: account.name,
            }).then((res) => {
              if (res.status === 201) {
                socket.emit("push_image", {
                  list: res.data,
                  idChat: chat._id,
                  dataLength: renamedFiles.length,
                })
              }
            });
          token &&
            insertChat(token, chat._id, dataMessage).then((res) => {
              if (res.status === 201) {
                data && setData([...data, res.data]);
                scrollToBottom();

                const currentChat =
                  list && list.filter((c: ChatByUser) => c._id === chat._id);
                const newChat =
                  list && list.filter((c: ChatByUser) => c._id !== chat._id);
                currentChat &&
                  newChat &&
                  setList([
                    {
                      ...currentChat[0],
                      lastMessage: "Sent images",
                    },
                    ...newChat,
                  ]);
              }
            });
        };
        socket.emit("push_image", {
          idChat: chat._id,
          message: dataMessage,
        });
        insertData();
      }
    });
  };
  const handleSendMessage = async () => {
    if (!value) return;
    const dataMessage = {
      message: endCode(`<p>${value}</p>`, process.env.NEXT_PUBLIC_K!),
      replyId: reply ? reply.id : "",
      replyContent: reply ? reply.content : "",
      replyInfo: reply ? `${reply.name} - ${reply.time}` : "",
      date: new Date(),
      time: new Date().toTimeString().slice(0, 8),
      emoji: [],
      status: "sent",
    };
    const token = await getToken();
    insertChat(token, chat._id, dataMessage).then((res) => {
      if (res.status === 201) {
        data && setData([...data, res.data]);
        setReply(null);
        const currentChat =
          list && list.filter((c: ChatByUser) => c._id === chat._id);
        const newChat =
          list && list.filter((c: ChatByUser) => c._id !== chat._id);
        currentChat &&
          newChat &&
          setList([
            {
              ...currentChat[0],
              lastMessage: decode(dataMessage.message, process.env.NEXT_PUBLIC_K!),
            },
            ...newChat,
          ]);
        scrollToBottom();
        setValue("");
      }
    });
  };
  const handleScroll = async () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight } = chatContainerRef.current;

      if (scrollTop === 0) {
        const token = await getToken();
        const limit = 20;
        const readPage = Math.ceil(count.read / limit);
        const unread = count.total - count.read;

        if (unread !== 0 && data) {
          // Lưu lại chiều cao của container trước khi fetch
          const previousHeight = scrollHeight;

          const res = await getChatById(token, chat._id, readPage + 1, limit);
          if (res.status === 200) {
            // Cập nhật dữ liệu
            setData([...res.data.data, ...data]);

            // Cập nhật count
            setCount({
              total: count.total,
              totalPage: count.totalPage,
              read: count.read + res.data.data.length,
            });

            // Đặt lại vị trí scroll
            requestAnimationFrame(() => {
              if (chatContainerRef.current) {
                const newHeight = chatContainerRef.current.scrollHeight;
                chatContainerRef.current.scrollTop = newHeight - previousHeight;
              }
            });
          }
        }
      }
    }
  };
  const handleScrollReply = async (id: string) => {
    const scrollToMessage = () => {
      const messageElement = document.getElementById(id);
      if (messageElement) {
        chatContainerRef.current?.scrollTo({
          top: messageElement.offsetTop,
          behavior: "smooth",
        });
      }
    };
    const includeCurrentChat = data && data.filter((d: Chat) => d._id === id);
    if (includeCurrentChat && includeCurrentChat.length === 0) {
      let isInclude = false; // Dùng để theo dõi xem dữ liệu có hợp lệ không
      const arrayData: any[] = [];
      const token = await getToken();
      const limit = 20;
      const readPage = Math.ceil(count.read / limit);
      let currentPage = readPage + 1;
      while (true) {
        try {
          const response = await getChatById(
            token,
            chat._id,
            currentPage,
            limit,
          );
          if (response.status === 200) {
            const { data: resData } = response.data;
            arrayData.push(...resData);

            // Kiểm tra nếu tìm thấy chat hiện tại
            const includeCurrentChat = resData.some((d: Chat) => d._id === id);
            if (includeCurrentChat) {
              isInclude = true; // Đánh dấu dữ liệu hợp lệ
              break; // Thoát khỏi vòng lặp
            }
          } else {
            break; // Nếu status không phải 200, thoát vòng lặp
          }
        } catch (error) {
          console.error("Error fetching chat data:", error);
          break; // Thoát vòng lặp nếu có lỗi khi gọi API
        }

        currentPage++; // Tăng số trang để tiếp tục tìm
      }
      if (!isInclude) {
        toast.error("Can't find chat");
        return;
      }
      data && setData([...arrayData, ...data]);
    }
    setTimeout(() => {
      scrollToMessage();
    }, 100);
  };
  const handleReaction = async (
    emoji: EmojiClickData,
    id: string,
    arrayEmoji?: any[],
  ) => {
    const dataUpdate = {
      type: "chat",
      emoji: emoji.emoji,
      detail: arrayEmoji,
    };
    const token = await getToken();
    updateChat(token, id, dataUpdate).then((res) => {
      if (res.status === 200) {
        socket.emit("reaction", {
          _id: id,
          idChat: chat._id,
          emoji: res.data,
        });
      }
    });
  };
  //this is function for socket
  useEffect(() => {
    socket.on("s_g_r_chat", (message: any) => {
      if (message.idChat !== chat._id) return;
      if (account && message.sender === account.idUser) return
      setTimeout(() => {
        scrollToBottom();
      }, 150);
      data && setData([...data, message]);
      const currentChat =
        list && list.filter((c: ChatByUser) => c._id === chat._id);
      const newChat =
        list && list.filter((c: ChatByUser) => c._id !== chat._id);
      currentChat &&
        newChat &&
        setList([
          {
            ...currentChat[0],
            lastMessage: decode(message.message, process.env.NEXT_PUBLIC_K!).include("<img") ? "Sent images" : decode(message.message, process.env.NEXT_PUBLIC_K!),
          },
          ...newChat,
        ]);
    });
    socket.on(
      "s_g_r_reaction",
      (value: { _id: string; idChat: string; emoji: any[] }) => {
        if (chat && value.idChat !== chat._id) return;
        data &&
          setData(
            data.map((d: any) => {
              return d._id !== value._id
                ? d
                : {
                  ...d,
                  emoji: value.emoji,
                };
            }),
          );
      },
    );
    return () => {
      socket.off("s_g_r_chat");
      socket.off("s_g_r_reaction");
    };
  }, [data, chat, list]);

  return (
    <section className="relative w-full h-[89%] sm:h-[95%] rounded-md flex flex-col justify-between overflow-hidden">
      <div ref={chatContainerRef} onScroll={handleScroll}
        className={`message-content w-full ${!reply ? "h-[92%]" : "h-[85%]"} max-h-[92%] py-2 rounded-md overflow-y-auto overflow-x-hidden transition-all`}>
        {isPending && (
          <div className="my-auto text-zinc-500 flex-1 flex flex-col items-center justify-center p-1 text-center">
            Loading...{" "}
          </div>
        )}
        {data && data.length === 0 && <EmptyMessage />}

        {account && data && data.length > 0 &&
          <ChatContentDetail props={data} account={account} handleScrollReply={handleScrollReply} handleReaction={handleReaction} reply={reply} setReply={setReply} />
        }
        {!chat && <EmptyChat />}
        <div ref={messagesEndRef} />
      </div>

      {account &&
        info &&
        info.user.filter((e: any) => e.idUser === account.idUser).length !== 0 && chat &&
        <MessagePanel reply={reply} setReply={setReply}
          value={value} setValue={setValue}
          onEmojiClick={onEmojiClick} handleUploadImage={handleUploadImage} handleSendMessage={handleSendMessage} />
      }
      {account &&
        info &&
        info.type === "group" &&
        info.user.filter((e: any) => e.idUser === account.idUser).length ===
        0 &&
        chat && (
          <div className={`message-input text-zinc-500 w-full ${!reply ? "h-[8%]" : "h-[15%]"} max-h-[15%] flex justify-center items-center pt-2 transition-all`}>
            You have left the group
          </div>
        )}
    </section>
  );
};

export default ChatDetail;