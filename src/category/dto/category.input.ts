import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CategoryInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  description?: string;
}
