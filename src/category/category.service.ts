// src/category/category.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';
import { CategoryInput } from './dto/category.input';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>) { }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findById(id: string): Promise<Category> {
    return this.categoryModel.findById(id).exec();
  }

  async create(category: CategoryInput): Promise<Category> {
    const newCategory = new this.categoryModel(category);
    return newCategory.save();
  }

  async update(id: string, category: Category): Promise<Category> {
    return this.categoryModel.findByIdAndUpdate(id, category, { new: true }).exec();
  }

  async delete(id: string): Promise<Category> {
    return this.categoryModel.findByIdAndDelete(id).exec();
  }
}
