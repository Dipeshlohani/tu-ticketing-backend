// src/booking/booking.resolver.ts

import { Resolver, Query, Args, Mutation, Float, Context } from '@nestjs/graphql';
import { BookingService } from './booking.service';
import { Booking } from './booking.schema';
import { CreateBookingInput } from './dto/create.booking.input';
import { UpdateBookingInput } from './dto/update.booking.input';
import { Dashboard } from './dto/dashboard.dto';
import { CategoryShare } from './dto/category-share.dto';
import { MonthlyReport } from './dto/monthly-report.dto';
import { YearlyReport } from './dto/yearly-report.dto';
import { BookingMonthlyReport } from './dto/booking-monthly-report.dto';
import { SubCategoryShare } from './dto/subcategory-share.dto';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Role } from 'src/enums';
import { Public } from 'src/auth/public.decorator';

@Resolver(() => Booking)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) { }

  @Mutation(() => Booking)
  async createBooking(
    @Args('createBookingInput') createBookingInput: CreateBookingInput,
    @Context() context
  ): Promise<Booking> {
    const user = context.user; // Get the user from the context
    if (!user) {
      throw new UnauthorizedException('You need to be logged in');
    }

    console.log('usercontext===>:', user)

    return this.bookingService.create({ ...createBookingInput }, user.name);
  }

  @Mutation(() => Booking)
  async verifyAndInvalidateBooking(@Args('ticket_no') ticket_no: string): Promise<Booking> {
    return this.bookingService.verifyAndInvalidateBooking(ticket_no);
  }

  @Query(returns => [Booking])
  async bookings(): Promise<Booking[]> {
    return this.bookingService.findAll();
  }

  @Query(() => Booking, { name: 'booking' })
  async findOne(@Args('id', { type: () => String }) id: string): Promise<Booking> {
    return this.bookingService.findOne(id);
  }

  @Mutation(() => Booking)
  async updateBooking(@Args('updateBookingInput') updateBookingInput: UpdateBookingInput): Promise<Booking> {
    return this.bookingService.update(updateBookingInput._id, updateBookingInput);
  }

  @Mutation(() => Booking)
  async removeBooking(@Args('id', { type: () => String }) id: string): Promise<Booking> {
    return this.bookingService.remove(id);
  }

  // New queries for revenue data
  @Query(() => Float)
  async totalRevenue(@Args('source') source: string): Promise<number> {
    return this.bookingService.getTotalRevenue(source);
  }

  @Query(() => Float)
  async yearlyRevenue(@Args('source') source: string): Promise<number> {
    return this.bookingService.getYearlyRevenue(source);
  }

  @Query(() => Float)
  async monthlyRevenue(@Args('source') source: string): Promise<number> {
    return this.bookingService.getMonthlyRevenue(source);
  }

  @Query(() => Float)
  async weeklyRevenue(@Args('source') source: string): Promise<number> {
    return this.bookingService.getWeeklyRevenue(source);
  }

  @Query(() => Float)
  async dailyRevenue(@Args('source') source: string): Promise<number> {
    return this.bookingService.getDailyRevenue(source);
  }

  @Query(() => Dashboard)
  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.ADMIN)
  async dashboard(): Promise<Dashboard> {
    return this.bookingService.getDashboardData();
  }

  @Query(() => MonthlyReport)
  async getMonthlyReport(
    @Args('year') year: number,
    @Args('month') month: string,
  ): Promise<MonthlyReport> {
    return this.bookingService.getMonthlyReport(year, month);
  }

  @Query(() => YearlyReport)
  async getYearlyReport(
    @Args('year') year: number
  ): Promise<YearlyReport> {
    return this.bookingService.getYearlyReport(year);
  }

  @Query(() => BookingMonthlyReport)
  async getMonthlyBookings(
    @Args('year') year: number,
    @Args('month') month: string,
  ): Promise<BookingMonthlyReport> {
    return this.bookingService.getMonthlyBookingsReport(year, month);
  }

  @Query(() => [CategoryShare])
  async getCategoryShare(): Promise<{ category: string, count: number }[]> {
    return this.bookingService.aggregateCategoryShare();
  }

  @Query(() => [SubCategoryShare])
  async getSubCategoryShare(): Promise<
    { subcategory: string; count: number }[]
  > {
    return this.bookingService.aggregateSubCategoryShare();
  }
}
