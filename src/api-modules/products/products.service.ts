import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Account } from 'src/api-modules/users/accounts/accounts.schema-model';
import { CategoryService } from 'src/api-modules/categories/categories.service';

import { Product, ProductModel, ProductsOutput } from './products.schema-model';
import { CreateProductInput } from './args/create-product.args';
import { GetProductsArgs } from './args/get-products.args';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: ProductModel,
    private readonly categoryService: CategoryService
  ) {}

  async createProduct(input: CreateProductInput, account: Account): Promise<Product> {
    return this.productModel.create({
      ...input,
      // create random 9-digit code
      code: Math.floor(Math.random() * 1000000000),
      createdBy: account._id,
    });
  }

  async getProducts(args: GetProductsArgs): Promise<ProductsOutput> {
    const { filter, sort, pagination } = args;
    const collection = await this.productModel
      .find({
        name: { $regex: filter?.searchTerm || '', $options: 'i' },
      })
      .skip(pagination?.skip || 0)
      .limit(pagination?.limit)
      .sort({ [sort?.sortBy || 'createdAt']: sort?.sortOrder || 1 } as any);
    const totalCount = await this.productModel
      .find({
        name: { $regex: filter?.searchTerm || '', $options: 'i' },
      })
      .countDocuments();

    return {
      collection,
      totalCount,
    };
  }

  async joinCategoryName(categoryId: Types.ObjectId): Promise<string> {
    const category = await this.categoryService.getCategoryById(categoryId);
    let name = category.name;

    if (category.parentCategoryId) {
      name += '/' + (await this.joinCategoryName(category.parentCategoryId));
    }

    return name;
  }

  async getProductCategoryNameById(categoryId: Types.ObjectId): Promise<string> {
    const name = await this.joinCategoryName(categoryId);

    return name.split('/').reverse().join('/');
  }
}
