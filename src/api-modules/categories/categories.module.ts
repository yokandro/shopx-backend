import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Category, CategorySchema } from './categories.schema-model';
import { CategoryService } from './categories.service';
import { CategoryResolver } from './categories.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
  exports: [CategoryService],
  providers: [CategoryService, CategoryResolver],
})
export class CategoryModule {}
