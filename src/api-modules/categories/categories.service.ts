import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Account } from 'src/api-modules/users/accounts/accounts.schema-model';

import { CategoriesPayload, Category, CategoryModel } from './categories.schema-model';
import type { CreateCategoryInput } from './args/create-category.args';
import { GetCategoriesArgs } from './args/get-categories.args';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private readonly categoryModel: CategoryModel) {}

  async createCategory(data: CreateCategoryInput, account: Account): Promise<Category> {
    return this.categoryModel.create({ ...data, createdBy: account._id });
  }

  async getCategories(args: GetCategoriesArgs): Promise<CategoriesPayload> {
    const { sort, pagination, filter } = args;

    const collection = await this.categoryModel
      .find({ name: { $regex: filter?.searchTerm || '', $options: 'i' } })
      .skip(pagination?.skip || 0)
      .limit(pagination?.limit)
      .sort({ [sort?.sortBy || 'createdAt']: sort?.sortOrder || 1 } as any);

    const totalCount = await this.categoryModel.countDocuments();

    return {
      collection,
      totalCount,
    };
  }

  async getParentCategoryPath(categoryId: Types.ObjectId): Promise<string> {
    return '';
  }
}
