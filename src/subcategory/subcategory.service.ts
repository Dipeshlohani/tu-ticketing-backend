// src/subcategory/subcategory.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subcategory, SubcategoryDocument } from './subcategory.schema';
import { SubCategoryInput } from './dto/subcategory.input';

@Injectable()
export class SubcategoryService {
  constructor(@InjectModel(Subcategory.name) private readonly subcategoryModel: Model<SubcategoryDocument>) { }

  async findAll(): Promise<Subcategory[]> {
    return this.subcategoryModel.find().exec();
  }
  async findByCategoryId(categoryId: string): Promise<Subcategory[]> {
    return this.subcategoryModel
      .find({ category: categoryId })
      .populate('category')
      .exec();
  }

  async findAllWithCategory(): Promise<Subcategory[]> {
    return this.subcategoryModel.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
    ]).exec();
  }


  async findById(id: string): Promise<Subcategory> {
    return this.subcategoryModel.findById(id).exec();
  }

  async create(subcategory: SubCategoryInput): Promise<Subcategory> {
    const newSubcategory = new this.subcategoryModel(subcategory);
    return newSubcategory.save();
  }

  async update(id: string, subcategory: SubCategoryInput): Promise<Subcategory> {
    return this.subcategoryModel.findByIdAndUpdate(id, subcategory, { new: true }).exec();
  }

  async delete(id: string): Promise<Subcategory> {
    return this.subcategoryModel.findByIdAndDelete(id).exec();
  }
}