import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { Subcategory } from 'src/subcategory/subcategory.schema';

@Schema()
@ObjectType()
export class Booking {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true, unique: true })
  @Field()
  ticket_no: string;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true })
  @Field()
  phone: string;

  @Prop({ required: true })
  @Field(() => Int)
  visitors: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  @Field(() => Category)
  category: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Subcategory',
    required: true,
  })
  @Field(() => Subcategory)
  subcategory: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  @Field(() => Float)
  price: number;

  @Prop({ required: true })
  @Field(() => Float)
  pawanMediaRevenue: number;

  @Prop({ required: true })
  @Field(() => Float)
  nagarpalikaTax: number;

  @Prop({ required: true })
  @Field(() => Float)
  parkRevenue: number;

  @Prop({ required: true })
  @Field()
  paymentMethod: string;

  @Prop()
  @Field({ nullable: true })
  remarks?: string;

  @Prop({ required: true, default: new Date() })
  @Field()
  createdAt: Date;

  @Prop({ required: true })
  @Field()
  createdBy: string;

  @Prop({ required: true, default: false })
  @Field()
  isValid: boolean;

  @Prop({ required: true })
  @Field()
  qrCodeData: string;
}

export type BookingDocument = Booking & Document;
export const BookingSchema = SchemaFactory.createForClass(Booking);
