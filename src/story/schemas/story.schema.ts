import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Story extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [Types.ObjectId], ref: 'Category' })
  categories: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  author: Types.ObjectId;
}

export const StorySchema = SchemaFactory.createForClass(Story);
