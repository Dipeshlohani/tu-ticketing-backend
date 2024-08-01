import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateBookingInput } from './create.booking.input';

@InputType()
export class UpdateBookingInput extends PartialType(CreateBookingInput) {
  @Field()
  _id: string;

  @Field()
  ticket_no: string;

  @Field()
  createdAt: string;

  @Field()
  createdBy: string;
}
