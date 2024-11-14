import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
export type ChatDocument = HydratedDocument<Chat>;
@Schema({ collection: 'chat', versionKey: false })
export class Chat extends Document {
    @Prop({ required: true })
    idChat: string
    @Prop({ required: true })
    sender: string
    @Prop({ required: false })
    replayMessage: string
    @Prop({ required: true })
    message: string
    @Prop({
        type: [
            {
                emoji: { type: String, required: true },
                idUser: { type: String, required: true },
            },
        ],
        required: false,
    })
    emoji: { emoji: string, idUser: string }[] | [];
    @Prop({ required: true })
    date: Date
    @Prop({ required: true })
    time: string
    @Prop({ required: false })
    status: string
    @Prop({ required: false })
    replyId: string
    @Prop({ required: false })
    replyContent: string
    @Prop({ required: false })
    replyInfo: string
}
@Schema({ collection: 'chat-info', versionKey: false })
export class ChatInfo {
    @Prop({ required: true })
    _id: string
    @Prop({ required: true })
    user: string[]
    @Prop({
        type: [
            {
                idUser: { type: String, required: false },
                date: { type: Date || String, default: null, required: false },
            },
        ], required: false
    })
    userAction: { idUser: string, isDelete: boolean, date: Date | string | null }[] | []
    @Prop({ required: false })
    owner: string
    @Prop({ required: true })
    created_at: Date
    @Prop({ required: true })
    updated_at: Date
    @Prop({ required: true })
    time: Date
    @Prop({ required: false })
    name: string
    @Prop({ required: false })
    avatar: string
    @Prop({ required: false })
    notification: string
    @Prop({ required: true })
    type: string
}
@Schema({ collection: 'chat-image', versionKey: false })
export class ChatImage {
    @Prop({ required: true })
    idChat: string
    @Prop({ required: true })
    idUser: string
    @Prop({ required: true })
    name: string
    @Prop({ required: true })
    image: string
    @Prop({ required: true })
    date: Date

}
@Schema({ collection: 'notification', versionKey: false })
export class Notification {
    @Prop({ required: true })
    idChat: string
    @Prop({ required: true })
    actorId: string
    @Prop({ required: false })
    targetId: string
    @Prop({ required: true })
    notification: string
    @Prop({ required: true })
    date: Date
    @Prop({ required: false })
    watched: Array<string>
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
export const ChatInfoSchema = SchemaFactory.createForClass(ChatInfo);
export const ChatImageSchema = SchemaFactory.createForClass(ChatImage);
export const NotificationSchema = SchemaFactory.createForClass(Notification);