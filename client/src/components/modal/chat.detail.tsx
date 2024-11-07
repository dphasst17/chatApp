import { Modal } from '@nextui-org/react'
import React, { use } from 'react'
import ConfirmModal from './confirm.modal';
import { getToken } from '@/utils/cookie';
import { StateContext } from '@/context/state';
import { leaveGroup, updateChat } from '@/api/chat';
import socket from '@/utils/socket';
import { ChatByUser } from '@/interface/chat';
import { chatStore } from '@/stores/chat';

const ModalChatDetail = ({ isOpen, onOpenChange, onClose, modal, handle, parameter, contentBtn, handleChangeMember, setModal, setHandle }:
    {
        isOpen: boolean, onOpenChange: () => void, onClose: () => void
        modal: string, handle: string, parameter: any, contentBtn: string, handleChangeMember: (parameter: any) => void,
        setModal: (modal: string) => void, setHandle: (handle: any) => void

    }) => {
    const { chat, setChat } = use(StateContext)
    const { list, setList } = chatStore();
    const handleUpdateOwner = async (data: { idUser: string }) => {
        const { idUser } = data;
        const token = await getToken();
        const _id = chat?._id;
        token &&
            updateChat(token, _id, { owner: idUser }).then((res) => {
                if (res.status === 200) {
                    socket.emit("chat_info", {
                        idChat: _id,
                        data: {
                            owner: idUser,
                        },
                    });
                } else {
                    console.log(res.message);
                }
                setModal("");
                setHandle(null);
                onClose();
            });
    };
    const handleLeaveChat = async () => {
        const token = await getToken();
        const _id = chat?._id;
        token &&
            leaveGroup(token, _id).then((res) => {
                if (res.status === 200) {
                    list && setList(list.filter((c: ChatByUser) => c._id !== _id));
                    setChat(null);
                } else {
                    console.log(res.message);
                }
                setModal("");
                setHandle(null);
                onClose();
            });
    };
    return <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
        <ConfirmModal
            type={modal}
            onClose={onClose}
            handle={() =>
                handle === "updateOwner"
                    ? handleUpdateOwner(parameter)
                    : handle === "updateMember"
                        ? handleChangeMember(parameter)
                        : handleLeaveChat()
            }
            contentBtn={contentBtn}
        />
    </Modal>
}

export default ModalChatDetail