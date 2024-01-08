import { Model, Types } from 'mongoose';

import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { BaseModel } from 'src/api-modules/common/common.schema-model';
import { Category } from 'src/api-modules/categories/categories.schema-model';

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

  @Field(() => Number)
  @Prop({ type: Number, required: true, min: 0, max: 5 })
  rating: number;

  @Field(() => Number)
  @Prop({ type: Number, unique: true, required: true })
  code: number;
}

export type ProductDocument = Category & Document;
export type ProductModel = Model<ProductDocument>;

export const ProductSchema = SchemaFactory.createForClass(Product);