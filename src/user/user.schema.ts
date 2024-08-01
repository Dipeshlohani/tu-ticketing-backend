import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role, Status } from '../enums';

@Schema()
@ObjectType()
export class User {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({})
  name: string;

  @Field()
  @Prop({ required: true })
  email: string;

  @Field()
  @Prop({ required: true })
  password: string;

  @Field(() => Role)
  @Prop({ type: String, enum: Role, default: Role.USER })
  role: Role;

  @Field(() => Status)
  @Prop({ type: String, enum: Status, default: Status.ACTIVE })
  status: Status;

  @Field()
  @Prop({})
  isActive: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
