import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Booking } from '../booking.schema';

@ObjectType()
class Totals {
  @Field(() => Float)
  pawanMediaRevenue: number;

  @Field(() => Float)
  nagarpalikaTax: number;

  @Field(() => Float)
  parkRevenue: number;

  @Field(() => Float)
  price: number;
}

@ObjectType()
export class BookingMonthlyReport {
  @Field(() => [Booking])
  bookings: Booking[];

  @Field(() => Totals)
  totals: Totals;
}
