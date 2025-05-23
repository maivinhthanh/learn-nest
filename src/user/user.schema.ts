import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken: string;

  // Optional: You can define _id if you want to make it explicit
  _id?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
