import { Friend } from '@/interface/account'
import { accountStore } from '@/stores/account'
import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React from 'react'

const FriendConfirm = ({ setModal, onClose }: { setModal: React.Dispatch<React.SetStateAction<string>>, onClose: () => void }) => {
    const { friendPending } = accountStore()
    return <ModalContent>
        <ModalHeader>Friend Request</ModalHeader>
        <ModalBody>
            <div className='w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-2 overflow-auto'>
                {friendPending && friendPending.map((f: Friend) => <div key={f._id} className='h-[60px]'>
                </div>)}
            </div>
        </ModalBody>
        <ModalFooter>
            <Button color='danger' onClick={() => { setModal(''), onClose() }}>Close</Button>
        </ModalFooter>
    </ModalContent>
}

export default FriendConfirm