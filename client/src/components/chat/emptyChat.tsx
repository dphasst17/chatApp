import { ChatSquare } from "../icon/icon"

export default function EmptyChat() {
    return (
        <div className="flex flex-col items-center justify-center p-4 text-center">
            <ChatSquare className="w-20 h-20 text-primary mb-8" />

            <h1 className="text-3xl font-bold text-zinc-950 mb-4">Welcome to Chat App</h1>

            <p className="text-zinc-900 max-w-md mx-auto mb-8">
                Connect with friends, family, and colleagues in real-time. Start a conversation to get going!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl w-full">
                <FeatureItem title="Create Groups" description="Start conversations with multiple people at once." />
                <FeatureItem title="Instant Messaging" description="Send and receive messages in real-time." />
                <FeatureItem title="Rich Media Sharing" description="Share photos, videos, and files easily." />
                <FeatureItem title="Secure Chats" description="End-to-end encryption for your privacy." />
            </div>
        </div>
    )
}

const FeatureItem = ({ title, description }: { title: string, description: string }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    )
}