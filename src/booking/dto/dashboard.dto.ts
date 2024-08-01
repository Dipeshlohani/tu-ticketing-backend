import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
class Revenue {
  @Field(() => Float)
  total: number;

  @Field(() => Float)
  yearly: number;

  @Field(() => Float)
  monthly: number;

  @Field(() => Float)
  weekly: number;

  @Field(() => Float)
  daily: number;
}

@ObjectType()
export class Dashboard {
  @Field(() => Revenue)
  overallRevenue: Revenue;

  @Field(() => Revenue)
  pawanMediaRevenue: Revenue;

  @Field(() => Revenue)
  nagarpalikaTax: Revenue;

  @Field(() => Revenue)
  parkRevenue: Revenue;

  @Field(() => Revenue)
  bookedTickets: Revenue;

  @Field(() => Revenue)
  visitors: Revenue;

  // @Field(() => Float)
  // totalUsers: number;

  // @Field(() => Float)
  // admins: number;

  // @Field(() => Float)
  // staffs: number;
}
