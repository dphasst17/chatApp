import React from 'react'
import { MessageCircle } from '../icon/icon'

const EmptyMessage = () => {
    return <div className="my-auto text-zinc-500 flex-1 flex flex-col items-center justify-center p-6 text-center">
        <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
            Start the conversation by sending your first message to Contact
            Name.
        </p>
    </div>
}

export default EmptyMessage