// src/subcategory/subcategory.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryResolver } from './subcategory.resolver';
import { Subcategory, SubcategorySchema } from './subcategory.schema';
import { CategoryService } from 'src/category/category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subcategory.name, schema: SubcategorySchema },
    ])],
  providers: [SubcategoryService, SubcategoryResolver],
  exports: [SubcategoryService],
})
export class SubcategoryModule { }