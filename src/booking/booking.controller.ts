// src/booking/booking.controller.ts

import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor, MulterModule } from '@nestjs/platform-express';
import { BookingService } from './booking.service';
import { Booking } from './booking.schema';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Booking[]> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.bookingService.uploadBookings(file);
  }
}