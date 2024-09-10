import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
@Schema({ collection: 'user', versionKey: false })
export class User extends Document {
    @Prop({ required: true })
    idUser: string

    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    email: string

    @Prop({ required: false })
    phone: string

    @Prop({ required: false })
    avatar: string

    @Prop({ required: true })
    online: boolean
}

export const UserSchema = SchemaFactory.createForClass(User);
