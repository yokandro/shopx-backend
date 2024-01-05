import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { BaseModel } from 'src/api-modules/common/common.schema-model';

@ObjectType()
@Schema()
export class Category extends BaseModel {
  @Field(() => String)
  @Prop({ type: String, required: true })
  name: string;

  @Field(() => Types.ObjectId, { nullable: true })
  @Prop({ type: Types.ObjectId })
  parentCategoryId?: Types.ObjectId;

  // resolvers
  @Field(() => String, { nullable: true })
  parentCategoryPath?: string;
}

@ObjectType()
export class CategoriesPayload {
  @Field(() => [Category])
  collection: Category[];

  @Field(() => Number)
  totalCount: number;
}

export type CategoryDocument = Category & Document;

export type CategoryModel = Model<CategoryDocument>;

export const CategorySchema = SchemaFactory.createForClass(Category);
