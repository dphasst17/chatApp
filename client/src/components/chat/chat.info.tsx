import { updateChat, uploadImages } from "@/api/chat";
import { StateContext } from "@/context/state";
import { ChatInfoUser, Friend } from "@/interface/account";
import { accountStore } from "@/stores/account";
import { getToken } from "@/utils/cookie";
import socket from "@/utils/socket";
import { Avatar, Badge, Button, Code, Input } from "@nextui-org/react";
import { use, useState } from "react";
import { EditIcon, EditImageIcon } from "../icon/icon";
import { handleInsertNotification, renameImageFile } from "@/utils/util";

const ChatInfoDetail = ({ info, dataImage, onOpen, onClose, handleLoadMoreImage, setModal, setHandle, setParameter, setContentBtn }
  : {
    info: any; dataImage: { total: number; read: number; data: any[] };
    onOpen: () => void, onClose: () => void; handleLoadMoreImage: () => void; setIsOpen: (isOpen: boolean) => void;
    setModal: (modal: string) => void, setHandle: (handle: any) => void, setParameter: (parameter: any) => void, setContentBtn: (contentBtn: string) => void
  }) => {
  const { mode, chat } = use(StateContext);
  const { account, friend } = accountStore();
  const [edit, setEdit] = useState("");
  const [addMember, setAddMember] = useState<boolean>(false);
  const [data, setData] = useState<{ [key: string]: string | File[] | any }>();

  const handleChange = async () => {
    if (!data) {
      setEdit("");
      return;
    }
    const dataImages = data.avatar ? renameImageFile(data.avatar[0]) : null;
    const convertData = dataImages
      ? { avatar: dataImages ? `${process.env.NEXT_PUBLIC_S3}/user/${dataImages.name}` : "" }
      : data;
    const message = dataImages ? "${actorId} has changed avatar " : "${actorId} has changed name";
    const images = new FormData();
    dataImages && images.append("files", dataImages);
    const token = await getToken();
    const _id = chat?._id;
    try {
      const upload = data.avatar &&
        uploadImages(images, "user")
      if (!upload) return
      const resUpdate = token && await updateChat(token, _id, convertData)
      const resNoti = token && await handleInsertNotification(token, _id, message)
      if (resUpdate.status !== 200 && resNoti.status !== 201) return
      socket.emit("chat_info", {
        idChat: _id,
        data: convertData,
      });
      resNoti.status === 201 && socket.emit('notification', {
        idChat: _id,
        detail: {
          ...resNoti.data,
          actorName: account?.name
        }
      })
      setEdit("");
    }
    catch (error) {
      console.log(error)
    }
  };
  const handleChangeMember = async (data: {
    type: "add" | "remove";
    id: string;
    userList: string[];
    name?: string;
    avatar?: string;
  }) => {
    const type = data.type;
    const id = data.id;
    const userList = data.userList;
    const name = data.name;
    const avatar = data.avatar;
    const userListData =
      type === "add"
        ? [...userList, id]
        : userList.filter((u: string) => u !== id);
    const incluseUserAction = info.userAction.filter(
      (u: any) => u.idUser === id,
    );
    const message = type === "add" ? "${actorId} has added ${targetId} to the group" : "${actorId} has removed ${targetId} from the group";
    const dataUpdate =
      incluseUserAction.length > 0
        ? {
          user: userListData,
        }
        : {
          user: userListData,
          userAction: [
            ...info.userAction,
            {
              idUser: id,
              date: new Date(),
            },
          ],
        };
    const token = await getToken();
    const _id = chat?._id;
    try {
      const resUpdate = token && await updateChat(token, _id, dataUpdate)
      const resNoti = token && await handleInsertNotification(token, _id, message, id)
      if (resUpdate.status !== 200 && resNoti.status !== 201) return
      socket.emit("chat_info", {
        idChat: _id,
        data: {
          user: type === "add"
            ? [...info.user, { idUser: id, name: name, avatar: avatar, }]
            : info.user.filter((u: any) => u.idUser !== id)
        }
      });
      resNoti.status === 201 && socket.emit('notification', {
        idChat: _id,
        detail: {
          ...resNoti.data,
          actorName: account?.name,
          targetName: name
        }
      })
      setModal("");
      setHandle(null);
      onClose();
    }
    catch (error) {
      console.log(error)
    }

  };

  return (
    chat && (
      <section className={`w-[400px] h-auto max-h-screen sm:max-h-[500px] rounded-md p-4 ${mode === "light" ? "bg-white text-[#1e1e1e]" : "bg-[#1e1e1e] text-zinc-50"}`}>
        <div className={`title w-full flex flex-col justify-center items-center`}>
          <div className="avatar w-full h-auto flex justify-center items-center">
            {(edit === "" || edit !== "avatar") &&
              info.owner === account?.idUser && (
                <Badge
                  classNames={{ badge: "rounded-md !ml-12" }}
                  content={
                    <label>
                      <EditImageIcon className="w-6 h-6 cursor-pointer" />
                      <input
                        type="file" className="hidden"
                        onChange={(e) => {
                          setData({ avatar: Array.from(e.target.files!) });
                          setEdit("avatar");
                        }}
                      />
                    </label>
                  }
                  shape="rectangle" placement="bottom-right"
                >
                  <Avatar isBordered radius="sm" alt="avatar" src={chat.avatar} size="lg" />
                </Badge>
              )}
            {edit === "avatar" && (
              <div className="w-full h-auto flex flex-wrap justify-center items-center">
                <div className="w-full flex justify-center items-center my-1">
                  <Avatar isBordered radius="sm" alt="avatar" src={data && data.avatar ? URL.createObjectURL(data.avatar[0]) : chat.avatar} size="lg" />
                </div>
                <Button size="sm" color="primary" className="m-1" onClick={handleChange}>
                  Save
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  className="m-1"
                  onClick={() => setEdit("")}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
          <div className="w-full h-auto flex justify-evenly items-center mt-4 mb-2">
            {account && (edit === "" || edit !== "info") && (
              <p className="flex items-center text-center  text-xl font-bold">
                {chat.name}
                {info.owner === account?.idUser && (
                  <EditIcon
                    onClick={() => setEdit("info")}
                    className="w-5 h-5 ml-2 cursor-pointer"
                  />
                )}
              </p>
            )}

            {account && edit === "info" && (
              <>
                <Input
                  size="sm"
                  className="w-2/4"
                  placeholder="Name"
                  defaultValue={chat.name}
                  onChange={(e) => setData({ name: e.target.value })}
                />
                <Button size="sm" color="primary" onClick={handleChange}>
                  Save
                </Button>
                <Button size="sm" color="danger" onClick={() => setEdit("")}>
                  Cancel
                </Button>
              </>
            )}
          </div>

          {/* Member */}
          {info.type === "group" && (
            <div className="memberList w-full h-auto grid grid-cols-3 gap-2 px-4">
              {info.owner === account?.idUser && (
                <Button
                  className=""
                  size="sm"
                  color="primary"
                  onClick={() => setAddMember(true)}
                >
                  Add member
                </Button>
              )}
              <p className="col-span-3 text-xl font-bold">Member</p>
              {info.user.map(
                (u: { idUser: string; name: string; avatar: string }) => (
                  <div
                    key={`member-${u.idUser}`}
                    className={`h-full flex flex-col justify-center items-center`}
                  >
                    <Avatar
                      key={u.idUser}
                      isBordered
                      radius="sm"
                      alt="avatar"
                      src={u.avatar}
                      size="lg"
                    />
                    <Code className={`my-1 cursor-pointer ${mode === "light" ? "bg-white text-zinc-900" : "bg-zinc-900 text-zinc-50"}`}>{u.name}</Code>
                    {account &&
                      info.owner === account.idUser &&
                      account.idUser === u.idUser ? (
                      <div className="h-[20px]"></div>
                    ) : (
                      <Button
                        size="sm"
                        color="primary"
                        className="h-[20px]"
                        onClick={() => {
                          setModal("confirm");
                          setHandle("updateOwner");
                          setParameter({ idUser: u.idUser });
                          setContentBtn("Set as owner");
                          onOpen();
                        }}
                      >
                        Set as owner
                      </Button>
                    )}
                  </div>
                ),
              )}
              {addMember && (
                <div className="col-span-3 w-full h-auto grid grid-cols-3 gap-2">
                  {friend &&
                    friend.map((f: Friend) => (
                      <div
                        key={f._id}
                        className="w-full flex flex-wrap justify-around items-center"
                      >
                        <div className="w-full flex justify-center items-center">
                          <Avatar isBordered radius="sm" alt="avatar" src={f.friend.avatar} size="lg" />
                        </div>
                        <p className="my-1 cursor-pointer">{f.friend.name}</p>
                        {info.user.filter(
                          (u: ChatInfoUser) => u.idUser === f.friend.idUser,
                        ).length !== 0 ? (
                          <Button
                            onClick={() => {
                              setModal("delete");
                              setHandle("updateMember");
                              setParameter({
                                type: "remove",
                                id: f.friend.idUser,
                                userList: info.user.map(
                                  (u: ChatInfoUser) => u.idUser,
                                ),
                              });
                              setContentBtn("Remove");
                              onOpen();
                            }}
                            isIconOnly key={f._id} size="sm" color="danger" className="w-5 h-5 rounded-md"
                          >
                            x
                          </Button>
                        ) : (
                          <Button
                            onClick={() =>
                              handleChangeMember({
                                type: "add",
                                id: f.friend.idUser,
                                userList: info.user.map(
                                  (u: ChatInfoUser) => u.idUser,
                                ),
                                name: f.friend.name,
                                avatar: f.friend.avatar,
                              })
                            }
                            isIconOnly key={f._id} size="sm" color="primary" className="w-5 h-5 rounded-md"
                          >
                            +
                          </Button>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Image */}
          <div className="imgList w-full h-auto grid grid-cols-4 gap-2 px-4">
            <p className="col-span-4 text-xl font-bold">Image</p>
            {dataImage.data.map((i: any) => (
              <img
                key={i._id}
                src={i.image}
                className="w-20 h-20 rounded-md cursor-pointer object-cover"
                alt=""
              />
            ))}
            {dataImage.total - dataImage.read > 0 && (
              <Button
                className="w-full h-full rounded-md"
                onClick={handleLoadMoreImage}
              >
                Load more
              </Button>
            )}
          </div>
          {account && info.type === "group" && info.owner !== account.idUser && (
            <div className="w-full h-[100px] flex items-center justify-center">
              <Button
                color="danger"
                radius="sm"
                onClick={() => {
                  setModal("delete"),
                    setHandle("leaveGroup"),
                    setContentBtn("Leave"),
                    onOpen();
                }}
              >
                Leave a group
              </Button>
            </div>
          )}
        </div>
      </section>
    )
  );
};
export default ChatInfoDetail;
