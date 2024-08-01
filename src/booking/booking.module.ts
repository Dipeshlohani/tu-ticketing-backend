// src/booking/booking.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingService } from './booking.service';
import { BookingResolver } from './booking.resolver';
import { Booking, BookingSchema } from './booking.schema';
import { Category, CategorySchema } from 'src/category/category.schema';
import { BookingController } from './booking.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [BookingService, BookingResolver],
  exports: [BookingService],
  controllers: [BookingController],
})
export class BookingModule { }
