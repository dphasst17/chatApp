import { Button, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React from 'react'

const ConfirmModal = ({ type, onClose, handle, contentBtn }: { type: string, onClose: () => void, handle: any, contentBtn?: string }) => {
    return <ModalContent>
        <ModalHeader>Are you sure?</ModalHeader>
        <ModalFooter>
            {type === "delete" && <Button color='danger' radius='sm' size="sm" onClick={handle}>{contentBtn ? contentBtn : 'Delete'}</Button>}
            {type === "confirm" && <Button color='primary' radius='sm' size="sm" onClick={handle}>{contentBtn ? contentBtn : 'Confirm'}</Button>}
            <Button color='default' radius='sm' size="sm" onClick={() => { onClose() }}>Close</Button>
        </ModalFooter>
    </ModalContent>
}

export default ConfirmModal