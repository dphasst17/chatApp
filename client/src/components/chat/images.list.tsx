import { Button, Modal, useDisclosure } from '@nextui-org/react'
import React, { useState } from 'react'
import ImagesDetail from '../modal/images.detail'

const ImagesList = ({ data, handleLoadMoreImage }: { data: any, handleLoadMoreImage: () => void }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [url, setUrl] = useState<string>("")
    return <>
        <div className="imgList w-full h-auto grid grid-cols-4 gap-2 px-4">
            <p className="col-span-4 text-xl font-bold">Image</p>
            {data.data.map((i: any) => (
                <img
                    onClick={() => { setUrl(i.image), onOpen() }}
                    key={i._id}
                    src={i.image}
                    className="w-20 h-20 rounded-md cursor-pointer object-cover"
                    alt=""
                />
            ))}
            {data.total - data.read > 0 && (
                <Button
                    className="w-full h-full rounded-md"
                    onClick={handleLoadMoreImage}
                >
                    Load more
                </Button>
            )}
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" classNames={{ base: '!z-50' }}>
            <ImagesDetail src={url} />
        </Modal>
    </>
}

export default ImagesList