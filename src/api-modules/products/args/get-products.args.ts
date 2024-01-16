import { Types } from 'mongoose';

import { ArgsType, Field, InputType } from '@nestjs/graphql';

import { CommonArgs } from 'src/api-modules/common/common.args';

@InputType()
export class GetProductsFilterInput {
  @Field(() => String, { nullable: true })
  searchTerm?: string;

  @Field(() => [String], { nullable: true })
  statuses?: string[];

  @Field(() => [Types.ObjectId], { nullable: true })
  categoryIds?: Types.ObjectId[];
}

@ArgsType()
export class GetProductsArgs extends CommonArgs {
  @Field(() => GetProductsFilterInput, { nullable: true })
  filter?: GetProductsFilterInput;
}
