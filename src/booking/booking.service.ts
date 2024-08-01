// src/booking/booking.service.ts

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './booking.schema';
import { CreateBookingInput } from './dto/create.booking.input';
import { UpdateBookingInput } from './dto/update.booking.input';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

import { Dashboard } from './dto/dashboard.dto';
import { MonthlyReport } from './dto/monthly-report.dto';
import { YearlyReport } from './dto/yearly-report.dto';
import { BookingMonthlyReport } from './dto/booking-monthly-report.dto';

interface BookingExcelData {
  name: string;
  phone: string;
  visitors: number;
  category: string;
  subcategory: string;
  price: number;
  pawanMediaRevenue: number;
  nagarpalikaTax: number;
  parkRevenue: number;
  paymentMethod: string;
  remarks: string;
  createdAt: string;
  createdBy: string;
}

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
  ) { }

  private generateTicketNumber(): string {
    const uniqueId = uuidv4().split('-')[0]; // Use the first part of the UUID
    return `En${uniqueId}`;
  }

  private async generateQRCode(data: string): Promise<string> {
    return QRCode.toDataURL(data);
  }

  async create(createBookingInput: CreateBookingInput, createdBy: string): Promise<Booking> {
    const ticket_no = await this.generateTicketNumber();

    const createdBooking = new this.bookingModel({
      ...createBookingInput,
      createdAt: new Date(),
      ticket_no,
      isValid: true,
      createdBy,
      qrCodeData: await this.generateQRCode(ticket_no),
    });
    return createdBooking.save();
  }

  async verifyAndInvalidateBooking(ticket_no: string): Promise<Booking> {
    const booking = await this.bookingModel.findOne({ ticket_no });

    if (!booking) {
      throw new BadRequestException('Invalid booking');
    }

    if (!booking.isValid) {
      throw new BadRequestException('Booking has already been used');
    }

    booking.isValid = false;
    return booking.save();
  }

  async findAll(): Promise<any[]> {
    return this.bookingModel
      .find({})
      .populate('category')
      .populate('subcategory')
    // .aggregate([
    //   {
    //     $lookup: {
    //       from: 'categories',
    //       localField: 'category',
    //       foreignField: '_id',
    //       as: 'categoryDetails',
    //     },
    //   },
    //   {
    //     $unwind: '$categoryDetails',
    //   },
    //   {
    //     $lookup: {
    //       from: 'subcategories',
    //       localField: 'subcategory',
    //       foreignField: '_id',
    //       as: 'subcategoryDetails',
    //     },
    //   },
    //   {
    //     $unwind: '$subcategoryDetails',
    //   },
    //   {
    //     $project: {
    //       name: 1,
    //       phone: 1,
    //       visitors: 1,
    //       category: '$categoryDetails.name',
    //       subcategory: '$subcategoryDetails.name',
    //       price: 1,
    //       pawanMediaRevenue: 1,
    //       ticket_no: 1,
    //       nagarpalikaTax: 1,
    //       parkRevenue: 1,
    //       paymentMethod: 1,
    //       remarks: 1,
    //       createdAt: 1,
    //       createdBy: 1,
    //     },
    //   },
    // ])
    // .exec();
  }

  async findOne(id: string): Promise<Booking> {
    return this.bookingModel.findById(id).exec();
  }

  async update(
    id: string,
    updateBookingInput: UpdateBookingInput,
  ): Promise<Booking> {
    return this.bookingModel
      .findByIdAndUpdate(id, updateBookingInput, { new: true })
      .populate('category')
      .populate('subcategory')
      .exec();
  }

  async remove(id: string): Promise<Booking> {
    return this.bookingModel.findOneAndDelete({ _id: id }).exec();
  }

  // Aggregation pipeline for revenue calculations
  private async aggregateRevenue(
    source: string,
    startDate?: Date,
  ): Promise<number> {
    const matchStage = startDate ? { createdAt: { $gte: startDate } } : {};
    const groupStage = {
      _id: null,
      total: { $sum: `$${source}` },
    };

    const result = await this.bookingModel
      .aggregate([{ $match: matchStage }, { $group: groupStage }])
      .exec();
    return result.length > 0 ? result[0].total : 0;
  }

  private async aggregateVisitors(startDate?: Date): Promise<number> {
    const matchStage = startDate ? { createdAt: { $gte: startDate } } : {};
    const groupStage = {
      _id: null,
      total: { $sum: '$visitors' },
    };

    const result = await this.bookingModel
      .aggregate([{ $match: matchStage }, { $group: groupStage }])
      .exec();
    return result.length > 0 ? result[0].total : 0;
  }

  private async countDocuments(startDate?: Date): Promise<number> {
    const matchStage = startDate ? { createdAt: { $gte: startDate } } : {};
    const result = await this.bookingModel.countDocuments(matchStage).exec();
    return result;
  }

  private async aggregatePrice(startDate?: Date): Promise<number> {
    const matchStage = startDate ? { createdAt: { $gte: startDate } } : {};
    const groupStage = {
      _id: null,
      total: { $sum: `$price` },
    };

    const result = await this.bookingModel
      .aggregate([{ $match: matchStage }, { $group: groupStage }])
      .exec();
    return result.length > 0 ? result[0].total : 0;
  }

  async getTotalVisitors(): Promise<number> {
    return this.aggregateVisitors();
  }
  async getYearlyVisitors(): Promise<number> {
    const startDate = moment().startOf('year').toDate();
    return this.aggregateVisitors(startDate);
  }

  async getMonthlyVisitors(): Promise<number> {
    const startDate = moment().startOf('month').toDate();
    return this.aggregateVisitors(startDate);
  }

  async getWeeklyVisitors(): Promise<number> {
    const startDate = moment().startOf('week').toDate();
    return this.aggregateVisitors(startDate);
  }

  async getDailyVisitors(): Promise<number> {
    const startDate = moment().startOf('day').toDate();
    return this.aggregateVisitors(startDate);
  }

  async getTotalRevenue(source: string): Promise<number> {
    return this.aggregateRevenue(source);
  }

  async getYearlyRevenue(source: string): Promise<number> {
    const startDate = moment().startOf('year').toDate();
    return this.aggregateRevenue(source, startDate);
  }

  async getMonthlyRevenue(source: string): Promise<number> {
    const startDate = moment().startOf('month').toDate();
    return this.aggregateRevenue(source, startDate);
  }

  async getWeeklyRevenue(source: string): Promise<number> {
    const startDate = moment().startOf('week').toDate();
    return this.aggregateRevenue(source, startDate);
  }

  async getDailyRevenue(source: string): Promise<number> {
    const startDate = moment().startOf('day').toDate();
    return this.aggregateRevenue(source, startDate);
  }
  async getTotalBookings(): Promise<number> {
    return this.countDocuments();
  }

  async getYearlyBookings(): Promise<number> {
    const startDate = moment().startOf('year').toDate();
    return this.countDocuments(startDate);
  }

  async getMonthlyBookings(): Promise<number> {
    const startDate = moment().startOf('month').toDate();
    return this.countDocuments(startDate);
  }

  async getWeeklyBookings(): Promise<number> {
    const startDate = moment().startOf('week').toDate();
    return this.countDocuments(startDate);
  }

  async getDailyBookings(): Promise<number> {
    const startDate = moment().startOf('day').toDate();
    return this.countDocuments(startDate);
  }

  async getTotalOverallRevenue(): Promise<number> {
    return this.aggregatePrice();
  }

  async getYearlyOverallRevenue(): Promise<number> {
    const startDate = moment().startOf('year').toDate();
    return this.aggregatePrice(startDate);
  }

  async getMonthlyOverallRevenue(): Promise<number> {
    const startDate = moment().startOf('month').toDate();
    return this.aggregatePrice(startDate);
  }

  async getWeeklyOverallRevenue(): Promise<number> {
    const startDate = moment().startOf('week').toDate();
    return this.aggregatePrice(startDate);
  }

  async getDailyOverallRevenue(): Promise<number> {
    const startDate = moment().startOf('day').toDate();
    return this.aggregatePrice(startDate);
  }
  // Method to get dashboard data
  async getDashboardData(): Promise<Dashboard> {
    const overallRevenue = {
      total: await this.getTotalOverallRevenue(),
      yearly: await this.getYearlyOverallRevenue(),
      monthly: await this.getMonthlyOverallRevenue(),
      weekly: await this.getWeeklyOverallRevenue(),
      daily: await this.getDailyOverallRevenue(),
    };

    const pawanMediaRevenue = {
      total: await this.getTotalRevenue('pawanMediaRevenue'),
      yearly: await this.getYearlyRevenue('pawanMediaRevenue'),
      monthly: await this.getMonthlyRevenue('pawanMediaRevenue'),
      weekly: await this.getWeeklyRevenue('pawanMediaRevenue'),
      daily: await this.getDailyRevenue('pawanMediaRevenue'),
    };

    const nagarpalikaTax = {
      total: await this.getTotalRevenue('nagarpalikaTax'),
      yearly: await this.getYearlyRevenue('nagarpalikaTax'),
      monthly: await this.getMonthlyRevenue('nagarpalikaTax'),
      weekly: await this.getWeeklyRevenue('nagarpalikaTax'),
      daily: await this.getDailyRevenue('nagarpalikaTax'),
    };

    const parkRevenue = {
      total: await this.getTotalRevenue('parkRevenue'),
      yearly: await this.getYearlyRevenue('parkRevenue'),
      monthly: await this.getMonthlyRevenue('parkRevenue'),
      weekly: await this.getWeeklyRevenue('parkRevenue'),
      daily: await this.getDailyRevenue('parkRevenue'),
    };

    const bookedTickets = {
      total: await this.getTotalBookings(),
      yearly: await this.getYearlyBookings(),
      monthly: await this.getMonthlyBookings(),
      weekly: await this.getWeeklyBookings(),
      daily: await this.getDailyBookings(),
    };

    const visitors = {
      total: await this.getTotalRevenue('visitors'),
      yearly: await this.getYearlyRevenue('visitors'),
      monthly: await this.getMonthlyRevenue('visitors'),
      weekly: await this.getWeeklyRevenue('visitors'),
      daily: await this.getDailyRevenue('visitors'),
    };

    return {
      overallRevenue,
      pawanMediaRevenue,
      nagarpalikaTax,
      parkRevenue,
      bookedTickets,
      visitors,
    };
  }

  async aggregateCategoryShare(): Promise<
    { category: string; count: number }[]
  > {
    const result = await this.bookingModel
      .aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: '_id',
            as: 'categoryInfo',
          },
        },
        {
          $unwind: '$categoryInfo',
        },
        {
          $project: {
            _id: 0,
            category: '$categoryInfo.name',
            count: 1,
          },
        },
      ])
      .exec();

    return result;
  }

  async aggregateSubCategoryShare(): Promise<
    { subcategory: string; count: number }[]
  > {
    const result = await this.bookingModel
      .aggregate([
        {
          $group: {
            _id: '$subcategory',
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'subcategories',
            localField: '_id',
            foreignField: '_id',
            as: 'subcategoryInfo',
          },
        },
        {
          $unwind: '$subcategoryInfo',
        },
        {
          $project: {
            _id: 0,
            subcategory: '$subcategoryInfo.name',
            count: 1,
          },
        },
      ])
      .exec();
    return result;
  }

  async getMonthlyReport(
    year: number,
    month: string,
  ): Promise<MonthlyReport | null> {
    const startOfMonth = moment(`${year}-${month}`, 'YYYY-MMMM')
      .startOf('month')
      .toDate();
    const endOfMonth = moment(`${year}-${month}`, 'YYYY-MMMM')
      .endOf('month')
      .toDate();

    const result = await this.bookingModel
      .aggregate([
        { $match: { createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
        {
          $group: {
            _id: null,
            pawanMedia: { $sum: '$pawanMediaRevenue' },
            thankotTribhuwanPark: { $sum: '$parkRevenue' },
            chandragiriMunicipality: { $sum: '$nagarpalikaTax' },
            total: { $sum: '$price' },
            paidToTTP: { $sum: '$parkRevenue' },
            totalSales: { $sum: '$price' },
          },
        },
      ])
      .exec();

    if (result.length === 0) {
      return null;
    }

    const [data] = result;

    return {
      month,
      pawanMedia: data.pawanMedia,
      thankotTribhuwanPark: data.thankotTribhuwanPark,
      chandragiriMunicipality: data.chandragiriMunicipality,
      total: data.total,
      paidToTTP: data.paidToTTP,
      totalSales: data.totalSales,
    };
  }

  async getYearlyReport(year: number): Promise<YearlyReport> {
    const months = moment.months();
    const monthlyReports = (
      await Promise.all(
        months.map((month) => this.getMonthlyReport(year, month)),
      )
    ).filter((report) => report !== null);

    return {
      year: year.toString(),
      monthlyReports: monthlyReports as MonthlyReport[],
    };
  }

  async getMonthlyBookingsReport(
    year: number,
    month: string,
  ): Promise<BookingMonthlyReport> {
    const startOfMonth = moment(`${year}-${month}`, 'YYYY-MMMM')
      .startOf('month')
      .toDate();
    const endOfMonth = moment(`${year}-${month}`, 'YYYY-MMMM')
      .endOf('month')
      .toDate();

    const bookings = await this.bookingModel
      .find({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      })
      .populate('category')
      .populate('subcategory')
      .exec();

    const totals = bookings.reduce(
      (acc, booking) => {
        acc.price += booking.price;
        acc.pawanMediaRevenue += booking.pawanMediaRevenue;
        acc.nagarpalikaTax += booking.nagarpalikaTax;
        acc.parkRevenue += booking.parkRevenue;
        return acc;
      },
      {
        pawanMediaRevenue: 0,
        nagarpalikaTax: 0,
        parkRevenue: 0,
        price: 0,
      },
    );
    console.log(bookings, totals);
    return { bookings, totals };
  }

  async uploadBookings(file: Express.Multer.File): Promise<Booking[]> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: BookingExcelData[] = XLSX.utils.sheet_to_json(worksheet);

    const bookings: Booking[] = [];
    const duplicateBookings: BookingExcelData[] = [];

    for (const data of jsonData) {
      const {
        name,
        phone,
        visitors,
        category,
        subcategory,
        price,
        pawanMediaRevenue,
        nagarpalikaTax,
        parkRevenue,
        paymentMethod,
        remarks,
        createdAt,
        createdBy,
      } = data;

      const existingBooking = await this.bookingModel.findOne({
        name,
        phone,
        visitors,
        createdAt: new Date(createdAt),
      });

      if (existingBooking) {
        duplicateBookings.push(data);
        continue; // Skip the duplicate booking
      }

      const newBooking = new this.bookingModel({
        name,
        phone,
        visitors,
        category,
        subcategory,
        price,
        pawanMediaRevenue,
        nagarpalikaTax,
        parkRevenue,
        paymentMethod,
        remarks,
        createdAt: new Date(createdAt),
        createdBy,
        ticket_no: this.generateTicketNumber(),
      });

      bookings.push(newBooking);
    }

    if (duplicateBookings.length > 0) {
      console.warn(
        `Duplicate bookings found: ${duplicateBookings
          .map((booking) => `${booking.name} on ${booking.createdAt}`)
          .join(', ')}`,
      );
    }

    return this.bookingModel.insertMany(bookings);
  }
}
