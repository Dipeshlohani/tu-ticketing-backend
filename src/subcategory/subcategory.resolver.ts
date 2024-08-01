// src/subcategory/subcategory.resolver.ts

import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Subcategory } from './subcategory.schema';
import { SubcategoryService } from './subcategory.service';
import { SubCategoryInput } from './dto/subcategory.input';

@Resolver('Subcategory')
export class SubcategoryResolver {
  constructor(
    private readonly subcategoryService: SubcategoryService,
  ) { }
  @Query(() => [Subcategory])
  async subcategories(): Promise<Subcategory[]> {
    return this.subcategoryService.findAllWithCategory();
  }

  @Query(returns => Subcategory)
  async subcategory(@Args('id') id: string): Promise<Subcategory> {
    return this.subcategoryService.findById(id);
  }

  @Query(() => [Subcategory])
  async subCategories(@Args('categoryId') categoryId: string): Promise<Subcategory[]> {
    return this.subcategoryService.findByCategoryId(categoryId);
  }

  @Mutation(() => Subcategory)
  async createSubcategory(@Args('subcategory') subcategory: SubCategoryInput): Promise<Subcategory> {
    return this.subcategoryService.create(subcategory);
  }

  @Mutation(returns => Subcategory)
  async updateSubcategory(@Args('id') id: string, @Args('subcategory') subcategory: SubCategoryInput): Promise<Subcategory> {
    return this.subcategoryService.update(id, subcategory);
  }

  @Mutation(returns => Subcategory)
  async deleteSubcategory(@Args('id') id: string): Promise<Subcategory> {
    return this.subcategoryService.delete(id);
  }
}