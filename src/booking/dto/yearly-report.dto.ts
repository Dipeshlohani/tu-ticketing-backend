// src/booking/dto/yearly-report.dto.ts

import { ObjectType, Field } from '@nestjs/graphql';
import { MonthlyReport } from './monthly-report.dto';

@ObjectType()
export class YearlyReport {
  @Field(() => String, { nullable: true })
  year: string;

  @Field(() => [MonthlyReport], { nullable: true })
  monthlyReports: MonthlyReport[];
}
