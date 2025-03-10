import { ModalBody, ModalContent, ModalHeader } from '@nextui-org/react'
import React from 'react'

const ImagesDetail = ({ src }: { src: string }) => {
    return <ModalContent>
        <ModalBody>
            <img src={src} alt="images-detail" style={{ width: '100%', height: '100%' }} />
        </ModalBody>
    </ModalContent>
}
export default ImagesDetail