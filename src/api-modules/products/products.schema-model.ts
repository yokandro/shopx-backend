import { Model, Types } from 'mongoose';

import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { BaseModel } from 'src/api-modules/common/common.schema-model';
import { Category } from 'src/api-modules/categories/categories.schema-model';

import { ProductStatuses } from './products.constants';

@ObjectType()
@Schema()
export class Product extends BaseModel {
  @Field(() => String)
  @Prop({ type: String, required: true })
  name: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  description?: string;

  @Field(() => Types.ObjectId)
  @Prop({ type: Types.ObjectId, required: true, ref: Category.name })
  categoryId: Types.ObjectId;

  @Field(() => Number)
  @Prop({ type: Number, required: true })
  price: number;

  @Field(() => Number, { nullable: true })
  @Prop({ type: Number, min: 0, max: 5 })
  rating?: number;

  @Field(() => Number)
  @Prop({ type: Number, unique: true, required: true })
  code: number;

  @Field(() => ProductStatuses)
  @Prop({ type: String, enum: ProductStatuses, default: ProductStatuses.DRAFT })
  status: ProductStatuses;

  // resolvers
  @Field(() => String)
  categoryName: string;
}

@ObjectType()
export class ProductsOutput {
  @Field(() => [Product])
  collection: Product[];

  @Field(() => Number)
  totalCount: number;
}

registerEnumType(ProductStatuses, { name: 'ProductStatuses' });

export type ProductDocument = Product & Document;
export type ProductModel = Model<ProductDocument>;

export const ProductSchema = SchemaFactory.createForClass(Product);
