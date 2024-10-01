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
    })// Specify the type here
    emoji: { emoji: string, idUser: string }[] | [];
    @Prop({ required: true })
    date: Date
    @Prop({ required: true })
    time: string
    @Prop({ required: false })
    status: string
}
@Schema({ collection: 'chat-info', versionKey: false })
export class ChatInfo {
    @Prop({ required: true })
    _id: string
    @Prop({ required: true })
    user: string[]
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

export const ChatSchema = SchemaFactory.createForClass(Chat);
export const ChatInfoSchema = SchemaFactory.createForClass(ChatInfo);
export const ChatImageSchema = SchemaFactory.createForClass(ChatImage);
