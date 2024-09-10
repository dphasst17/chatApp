import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'auth', versionKey: false })
export class Auth extends Document {
    @Prop({ required: true })
    idUser: string
    @Prop({ required: true })
    username: string;
    @Prop({ required: true })
    password: string;
    @Prop({ required: true })
    createdAt: Date;
    @Prop({ required: true })
    action: string
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
