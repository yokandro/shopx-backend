import { Model, Types } from 'mongoose';

import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Account } from 'src/api-modules/accounts/accounts.schema-model';
import { BaseModel } from 'src/api-modules/common/common.schema-model';

@ObjectType()
@Schema()
export class User extends BaseModel {
  @Field(() => String)
  @Prop({ type: String, required: true })
  firstName: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  lastName: string;

  @Field(() => Types.ObjectId)
  @Prop({ type: Types.ObjectId, required: true, ref: Account.name })
  accountId: Types.ObjectId;

  // resolvers
  @Field(() => Account)
  account: Account;
}

@ObjectType()
export class UsersOutput {
  @Field(() => [User])
  collection: User[];

  @Field(() => Number)
  totalCount: number;
}

export type UserDocument = User & Document;
export type UserModel = Model<UserDocument>;

export const UserSchema = SchemaFactory.createForClass(User);
