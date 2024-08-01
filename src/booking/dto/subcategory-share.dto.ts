import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class SubCategoryShare {
  @Field()
  subcategory: string;

  @Field(() => Int)
  count: number;
}
