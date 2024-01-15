import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Account } from 'src/api-modules/accounts/accounts.schema-model';

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

    const totalCount = await this.categoryModel
      .find({ name: { $regex: filter?.searchTerm || '', $options: 'i' } })
      .countDocuments();

    return {
      collection,
      totalCount,
    };
  }

  async joinCategoryName(categoryId: Types.ObjectId): Promise<string> {
    const category = await this.getCategoryById(categoryId);
    let name = category.name;

    if (category.parentCategoryId) {
      name += '/' + (await this.joinCategoryName(category.parentCategoryId));
    }

    return name;
  }

  async getCategoryNameById(categoryId: Types.ObjectId): Promise<string> {
    if (!categoryId) return '';

    const name = await this.joinCategoryName(categoryId);

    return name.split('/').reverse().join('/');
  }

  async getCategoryById(id: Types.ObjectId): Promise<Category> {
    return this.categoryModel.findById(id);
  }
}
