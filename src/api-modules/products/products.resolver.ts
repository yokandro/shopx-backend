import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AccessTokenGuard } from 'src/api-modules/auth/guards/access-token.guard';
import { Account } from 'src/api-modules/users/accounts/accounts.schema-model';
import { CurrentAccount } from 'src/api-modules/auth/auth.decorators';

import { Product, ProductsOutput } from './products.schema-model';
import { ProductsService } from './products.service';
import { CreateProductArgs } from './args/create-product.args';
import { GetProductsArgs } from './args/get-products.args';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

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

  @ResolveField(() => String)
  async categoryName(@Parent() { categoryId }: Product) {
    return this.productsService.getProductCategoryNameById(categoryId);
  }
}
