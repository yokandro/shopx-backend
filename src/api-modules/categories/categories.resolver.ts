import { Types } from 'mongoose';

import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AccessTokenGuard } from 'src/api-modules/auth/guards/access-token.guard';
import { Account } from 'src/api-modules/accounts/accounts.schema-model';
import { CurrentAccount } from 'src/api-modules/auth/auth.decorators';

import { CategoryService } from './categories.service';
import { CategoriesPayload, Category } from './categories.schema-model';
import { CreateCategoryArgs } from './args/create-category.args';
import { GetCategoriesArgs } from './args/get-categories.args';
import { UpdateCategoryArgs } from './args/update-category.args';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => Category)
  @UseGuards(AccessTokenGuard)
  async createCategory(
    @Args({ type: () => CreateCategoryArgs }) args: CreateCategoryArgs,
    @CurrentAccount() account: Account
  ): Promise<Category> {
    return this.categoryService.createCategory(args.input, account);
  }

  @Mutation(() => Category)
  @UseGuards(AccessTokenGuard)
  async updateCategory(
    @Args({ type: () => UpdateCategoryArgs }) args: UpdateCategoryArgs,
    @CurrentAccount() account: Account
  ): Promise<Category> {
    return this.categoryService.updateCategory(args.input, account);
  }

  @Mutation(() => Boolean)
  @UseGuards(AccessTokenGuard)
  async deleteCategoryById(@Args('categoryId') categoryId: Types.ObjectId): Promise<boolean> {
    return this.categoryService.deleteCategoryById(categoryId);
  }

  @Query(() => CategoriesPayload)
  @UseGuards(AccessTokenGuard)
  async getCategories(
    @Args({ type: () => GetCategoriesArgs }) args: GetCategoriesArgs
  ): Promise<CategoriesPayload> {
    return this.categoryService.getCategories(args);
  }

  @ResolveField(() => String, { nullable: true })
  async categoryName(@Parent() { parentCategoryId }: Category): Promise<string> {
    if (!parentCategoryId) return null;
    return this.categoryService.getCategoryNameById(parentCategoryId);
  }
}
