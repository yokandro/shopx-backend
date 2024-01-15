import { ArgsType, Field, InputType } from '@nestjs/graphql';

import { CommonArgs } from 'src/api-modules/common/common.args';

@InputType()
export class GetUsersFilterInput {
  @Field(() => String, { nullable: true })
  searchTerm?: string;

  @Field(() => [String], { nullable: true })
  statuses?: string[];

  @Field(() => [String], { nullable: true })
  roles: string[];
}

@ArgsType()
export class GetUsersArgs extends CommonArgs {
  @Field(() => GetUsersFilterInput, { nullable: true })
  filter?: GetUsersFilterInput;
}
