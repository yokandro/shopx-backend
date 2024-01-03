import { Document, Model } from 'mongoose';

import { Field, ObjectType } from '@nestjs/graphql';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

import { BaseModel } from 'src/api-modules/common/common.schema-model';

@ObjectType()
@Schema()
export class Account extends BaseModel {
  @Field(() => String)
  @Prop({ type: String, required: true, unique: true, index: true })
  email: string;

  @Field(() => String)
  @Prop({ type: String, required: true, unique: true })
  hashedPassword: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  firstName: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  lastName: string;

  @Field(() => String)
  @Prop({ type: String })
  hashedRefreshToken?: string;
}

export type AccountDocument = Account & Document;

export type AccountModel = Model<AccountDocument>;

export const AccountSchema = SchemaFactory.createForClass(Account);
