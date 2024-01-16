import { Types } from 'mongoose';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Account } from 'src/api-modules/accounts/accounts.schema-model';
import { ProductEventsEnum } from 'src/api-modules/products/products.constants';

import { CategoriesPayload, Category, CategoryModel } from './categories.schema-model';
import type { CreateCategoryInput } from './args/create-category.args';
import { GetCategoriesArgs } from './args/get-categories.args';
import { UpdateCategoryInput } from './args/update-category.args';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: CategoryModel,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async createCategory(data: CreateCategoryInput, account: Account): Promise<Category> {
    return this.categoryModel.create({ ...data, createdBy: account._id });
  }

  async updateCategory(input: UpdateCategoryInput, account: Account): Promise<Category> {
    const { categoryId, ...data } = input;

    return this.categoryModel.findOneAndUpdate(
      categoryId,
      { $set: { ...data, updatedBy: account._id } },
      { new: true }
    );
  }

  async deleteCategoryById(categoryId: Types.ObjectId): Promise<boolean> {
    const category = await this.categoryModel.deleteOne(categoryId);

    this.eventEmitter.emit(ProductEventsEnum.DELETE_CATEGORY, categoryId);

    return !!category;
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
    if (!category) return '';
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
