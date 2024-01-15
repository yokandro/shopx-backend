import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AccessTokenGuard } from 'src/api-modules/auth/guards/access-token.guard';
import { Account } from 'src/api-modules/accounts/accounts.schema-model';
import { CurrentAccount } from 'src/api-modules/auth/auth.decorators';

import { CategoryService } from './categories.service';
import { CategoriesPayload, Category } from './categories.schema-model';
import { CreateCategoryArgs } from './args/create-category.args';
import { GetCategoriesArgs } from './args/get-categories.args';

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

  @Query(() => CategoriesPayload)
  @UseGuards(AccessTokenGuard)
  async getCategories(
    @Args({ type: () => GetCategoriesArgs }) args: GetCategoriesArgs
  ): Promise<CategoriesPayload> {
    return this.categoryService.getCategories(args);
  }

  @ResolveField(() => String)
  async categoryName(@Parent() { parentCategoryId }: Category): Promise<string> {
    return this.categoryService.getCategoryNameById(parentCategoryId);
  }
}
