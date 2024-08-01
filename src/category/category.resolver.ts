// src/category/category.resolver.ts

import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Category } from './category.schema';
import { CategoryService } from './category.service';
import { CategoryInput } from './dto/category.input';

@Resolver('Category')
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) { }

  @Query(returns => [Category])
  async categories(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Query(returns => Category)
  async category(@Args('id') id: string): Promise<Category> {
    return this.categoryService.findById(id);
  }

  @Mutation(returns => Category)
  async createCategory(@Args('category') category: CategoryInput): Promise<Category> {
    return this.categoryService.create(category);
  }

  @Mutation(returns => Category)
  async updateCategory(@Args('id') id: string, @Args('category') category: Category): Promise<Category> {
    return this.categoryService.update(id, category);
  }

  @Mutation(returns => Category)
  async deleteCategory(@Args('id') id: string): Promise<Category> {
    return this.categoryService.delete(id);
  }
}
