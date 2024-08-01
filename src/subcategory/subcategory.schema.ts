// src/subcategory/subcategory.schema.ts

import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from '../category/category.schema';

@Schema()
@ObjectType()
export class Subcategory {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop()
  price: string;

  @Field()
  @Prop()
  pawanmedia: string;

  @Field()
  @Prop()
  nagarpalika_tax: string;

  @Field()
  @Prop()
  park: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  @Field(() => Category)
  category: MongooseSchema.Types.ObjectId;
}

export type SubcategoryDocument = Subcategory & Document;

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);
