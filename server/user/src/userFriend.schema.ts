import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
export type UserFriendDocument = HydratedDocument<Friend>;
@Schema({ collection: 'friend', versionKey: false })
export class Friend extends Document {
    @Prop({ required: true })
    idUser: string;
    @Prop({ required: true })
    idFriend: string;
    @Prop({ required: true })
    created_at: Date;
    @Prop({ required: true })
    updated_at: Date;
    @Prop({ required: true })
    status: string;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);
