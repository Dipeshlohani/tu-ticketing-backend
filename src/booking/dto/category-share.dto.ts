// category-share.dto.ts

import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class CategoryShare {
  @Field()
  category: string;

  @Field(() => Int)
  count: number;
}
