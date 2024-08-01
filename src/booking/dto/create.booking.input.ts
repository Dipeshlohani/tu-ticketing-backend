import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateBookingInput {
  @Field()
  name: string;

  @Field()
  phone: string;

  @Field()
  visitors: number;

  @Field()
  category: string;

  @Field()
  subcategory: string;

  @Field()
  paymentMethod: string;

  @Field({ nullable: true })
  remarks?: string;

  @Field()
  price: number;

  @Field()
  pawanMediaRevenue: number;

  @Field()
  nagarpalikaTax: number;

  @Field()
  parkRevenue: number;
}
