// src/booking/dto/monthly-report.dto.ts

import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class MonthlyReport {
  @Field()
  month: string;

  @Field(() => Float)
  pawanMedia: number;

  @Field(() => Float)
  thankotTribhuwanPark: number;

  @Field(() => Float)
  chandragiriMunicipality: number;

  @Field(() => Float)
  total: number;

  @Field(() => Float)
  paidToTTP: number;

  @Field(() => Float)
  totalSales: number;
}
