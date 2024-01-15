import { ArgsType, Field, InputType } from '@nestjs/graphql';

import { CommonArgs } from 'src/api-modules/common/common.args';

@InputType()
export class GetAccountsFilter {
  @Field(() => String, { nullable: true })
  searchTerm?: string;
}

@ArgsType()
export class GetAccountsArgs extends CommonArgs {
  @Field(() => GetAccountsFilter, { nullable: true })
  filter?: GetAccountsFilter;
}
