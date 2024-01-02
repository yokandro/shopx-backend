import { Types as SchemaTypes } from 'mongoose';

import { Field, ObjectType } from '@nestjs/graphql';
import { Schema, Prop } from '@nestjs/mongoose';

@ObjectType()
@Schema()
export class BaseModel {
  @Field(() => String)
  _id: SchemaTypes.ObjectId;

  @Field(() => Date)
  @Prop({ default: Date.now, index: true })
  createdAt: Date;

  @Field(() => Date)
  @Prop({ default: Date.now, index: true })
  updatedAt: Date;

  @Field(() => Boolean)
  @Prop({ type: Boolean, default: false, index: true })
  deleted: boolean;

  @Field(() => Date, { nullable: true })
  @Prop({ index: true })
  deletedAt?: Date;

  @Field(() => String, { nullable: true })
  @Prop({ index: true })
  createdBy?: SchemaTypes.ObjectId;

  @Field(() => String, { nullable: true })
  @Prop({ index: true })
  updatedBy?: SchemaTypes.ObjectId;

  @Field(() => String, { nullable: true })
  @Prop({ index: true })
  deletedBy?: SchemaTypes.ObjectId;
}
