// src/subcategory/dto/subcategory.input.ts

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SubCategoryInput {
  @Field()
  name: string;

  @Field()
  price: string;

  @Field()
  pawanmedia: string;

  @Field()
  nagarpalika_tax: string;

  @Field()
  park: string;

  @Field()
  category: string;
}
