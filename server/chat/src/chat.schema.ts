import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
export type ChatDocument = HydratedDocument<Chat>;
@Schema({ collection: 'chat', versionKey: false })
export class Chat extends Document {
    @Prop({ required: true })
    _id: string
    @Prop({ required: true })
    idChat: string
    @Prop({ required: true })
    sender: string
    @Prop({ required: false })
    replayMessage: string
    @Prop({ required: true })
    message: string
    @Prop({ type: [String], required: false }) // Specify the type here
    emoji: string | string[];
    @Prop({ required: true })
    date: Date
    @Prop({ required: true })
    time: Date
    @Prop({ required: true })
    status: string
}
@Schema({ collection: 'chat-info', versionKey: false })
export class ChatInfo {
    @Prop({ required: true })
    _id: string
    @Prop({ required: true })
    user: string[]
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
    _id: string
    @Prop({ required: true })
    idChat: string
    @Prop({ required: true })
    idUser: string
    @Prop({ required: true })
    image: string
    @Prop({ required: true })
    date: string

}

export const ChatSchema = SchemaFactory.createForClass(Chat);
export const ChatInfoSchema = SchemaFactory.createForClass(ChatInfo);
export const ChatImageSchema = SchemaFactory.createForClass(ChatImage);