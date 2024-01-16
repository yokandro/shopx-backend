import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Account } from 'src/api-modules/accounts/accounts.schema-model';
import { getPaginatedPipeline } from 'src/api-modules/common/helpers/pipelines.helpers';

import { Product, ProductModel, ProductsOutput } from './products.schema-model';
import { CreateProductInput } from './args/create-product.args';
import { GetProductsArgs } from './args/get-products.args';
import { ChangeProductStatusInput } from './args/change-product-status.args';
import { UpdateProductInput } from './args/update-product.args';
import { Types } from 'mongoose';
import { ProductStatuses } from './products.constants';

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

  async updateProduct(input: UpdateProductInput, account: Account): Promise<Product> {
    const { productId, ...dataToUpdate } = input;
    const product = await this.productModel.findById(productId);

    if (product && product.status === ProductStatuses.PUBLISHED) {
      throw new Error('Cannot update published product');
    }

    return this.productModel.findByIdAndUpdate(
      productId,
      { $set: { ...dataToUpdate, updatedBy: account._id } },
      { new: true }
    );
  }

  async deleteProductById(productId: Types.ObjectId): Promise<boolean> {
    const product = await this.productModel.findById(productId);

    if (product && product.status === ProductStatuses.PUBLISHED) {
      throw new Error('Cannot delete published product');
    }

    await this.productModel.deleteOne(productId);

    return true;
  }

  async changeProductStatus(
    { productId, status }: ChangeProductStatusInput,
    account: Account
  ): Promise<Product> {
    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    return this.productModel.findByIdAndUpdate(
      productId,
      { $set: { status, updatedBy: account._id } },
      { new: true }
    );
  }

  async getProductsByCategoryId(categoryId: Types.ObjectId): Promise<Product[]> {
    return this.productModel.find({ categoryId });
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
          pipeline: [
            {
              $match:
                filter?.categoryIds && filter.categoryIds.length > 0
                  ? {
                      _id: { $in: filter.categoryIds },
                    }
                  : {},
            },
          ],
        },
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          searchTerm: {
            $concat: ['$name', { $toString: '$code' }, { $ifNull: ['$category.name', ''] }],
          },
        },
      },
      {
        $match: {
          searchTerm: { $regex: filter.searchTerm, $options: 'i' },
          ...(filter.statuses && { status: { $in: filter.statuses } }),
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
