import { Types } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';

import { ProductEventsEnum } from './products.constants';
import { Product, ProductModel } from './products.schema-model';

@Injectable()
export class ProductEvents {
  constructor(@InjectModel(Product.name) private readonly productsModel: ProductModel) {}

  @OnEvent(ProductEventsEnum.DELETE_CATEGORY)
  async handleDeleteCategory(categoryId: Types.ObjectId) {
    return this.productsModel.updateMany({ categoryId }, { $unset: { categoryId: 1 } });
  }
}
