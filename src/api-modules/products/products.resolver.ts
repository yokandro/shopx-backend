import { Types } from 'mongoose';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AccessTokenGuard } from 'src/api-modules/auth/guards/access-token.guard';
import { Account } from 'src/api-modules/accounts/accounts.schema-model';
import { CurrentAccount } from 'src/api-modules/auth/auth.decorators';
import { CategoryService } from 'src/api-modules/categories/categories.service';

import { Product, ProductsOutput } from './products.schema-model';
import { ProductsService } from './products.service';
import { CreateProductArgs } from './args/create-product.args';
import { GetProductsArgs } from './args/get-products.args';
import { ChangeProductStatusArgs } from './args/change-product-status.args';
import { UpdateProductArgs } from './args/update-product.args';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoryService: CategoryService
  ) {}

  @Query(() => ProductsOutput)
  @UseGuards(AccessTokenGuard)
  async getProducts(@Args({ type: () => GetProductsArgs }) args: GetProductsArgs) {
    return this.productsService.getProducts(args);
  }

  @Mutation(() => Product)
  @UseGuards(AccessTokenGuard)
  async createProduct(
    @Args({ type: () => CreateProductArgs }) { input }: CreateProductArgs,
    @CurrentAccount() account: Account
  ) {
    return this.productsService.createProduct(input, account);
  }

  @Mutation(() => Product)
  @UseGuards(AccessTokenGuard)
  async updateProduct(
    @Args({ type: () => UpdateProductArgs }) { input }: UpdateProductArgs,
    @CurrentAccount() account: Account
  ) {
    return this.productsService.updateProduct(input, account);
  }

  @Mutation(() => Boolean)
  @UseGuards(AccessTokenGuard)
  async deleteProductById(
    @Args('productId', { type: () => Types.ObjectId }) productId: Types.ObjectId
  ) {
    return this.productsService.deleteProductById(productId);
  }

  @Mutation(() => Product)
  @UseGuards(AccessTokenGuard)
  async changeProductStatus(
    @Args({ type: () => ChangeProductStatusArgs }) { input }: ChangeProductStatusArgs,
    @CurrentAccount() account: Account
  ) {
    return this.productsService.changeProductStatus(input, account);
  }

  @ResolveField(() => String)
  async categoryName(@Parent() { categoryId }: Product) {
    return this.categoryService.getCategoryNameById(categoryId);
  }
}
