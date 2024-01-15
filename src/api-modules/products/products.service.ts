import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Account } from 'src/api-modules/accounts/accounts.schema-model';
import { getPaginatedPipeline } from 'src/api-modules/common/helpers/pipelines.helpers';

import { Product, ProductModel, ProductsOutput } from './products.schema-model';
import { CreateProductInput } from './args/create-product.args';
import { GetProductsArgs } from './args/get-products.args';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private readonly productModel: ProductModel) {}

  async createProduct(input: CreateProductInput, account: Account): Promise<Product> {
    return this.productModel.create({
      ...input,
      // create random 9-digit code
      code: Math.floor(Math.random() * 1000000000),
      createdBy: account._id,
    });
  }

  async getProducts(args: GetProductsArgs): Promise<ProductsOutput> {
    const { filter } = args;

    const [{ totalCount = 0, collection = [] }] = await this.productModel.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $addFields: {
          searchTerm: { $concat: ['$name', { $toString: '$code' }, '$category.name'] },
        },
      },
      {
        $match: {
          searchTerm: { $regex: filter.searchTerm, $options: 'i' },
        },
      },
      ...getPaginatedPipeline(args.sort, args.pagination),
    ]);

    return {
      collection,
      totalCount,
    };
  }
}
