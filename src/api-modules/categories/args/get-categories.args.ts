import { ArgsType, Field, InputType } from '@nestjs/graphql';

import { CommonArgs } from 'src/api-modules/common/common.args';

@InputType()
export class GetCategoryFilterInput {
  @Field(() => String, { nullable: true })
  searchTerm?: string;
}

@ArgsType()
export class GetCategoriesArgs extends CommonArgs {
  @Field(() => GetCategoryFilterInput, { nullable: true })
  filter?: GetCategoryFilterInput;
}
