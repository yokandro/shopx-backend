import { Document, Model } from 'mongoose';

import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

import { BaseModel } from 'src/api-modules/common/common.schema-model';

import { AccountStatuses, Roles } from './accounts.constants';

@ObjectType()
@Schema()
export class Account extends BaseModel {
  @Field(() => String)
  @Prop({ type: String, required: true, unique: true, index: true })
  email: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  hashedPassword?: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  hashedRefreshToken?: string;

  @Field(() => AccountStatuses)
  @Prop({ type: String, enum: AccountStatuses, default: AccountStatuses.INACTIVE })
  status: AccountStatuses;

  @Field(() => Roles)
  @Prop({ type: String, enum: Roles })
  role: Roles;
}

registerEnumType(AccountStatuses, { name: 'AccountStatuses' });
registerEnumType(Roles, { name: 'Roles' });

export type AccountDocument = Account & Document;

export type AccountModel = Model<AccountDocument>;

export const AccountSchema = SchemaFactory.createForClass(Account);
