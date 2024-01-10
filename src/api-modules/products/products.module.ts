import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoryModule } from 'src/api-modules/categories/categories.module';

import { Product, ProductSchema } from './products.schema-model';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CategoryModule,
  ],
  providers: [ProductsService, ProductsResolver],
})
export class ProductsModule {}
