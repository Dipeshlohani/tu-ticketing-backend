// src/category/category.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { Category, CategorySchema } from './category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])
  ],
  providers: [CategoryService, CategoryResolver],
  exports: [CategoryService],
})
export class CategoryModule { }