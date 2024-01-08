import { Inject, Injectable } from '@nestjs/common';

import { Product, ProductModel } from './products.schema-model';

@Injectable()
export class ProductsService {
  constructor(@Inject(Product.name) private readonly productModel: ProductModel) {}

  async createProduct(): Promise<Product> {
    return null;
  }
}
