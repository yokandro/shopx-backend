import { ArgsType, Field, InputType } from '@nestjs/graphql';

import { Roles } from 'src/api-modules/accounts/accounts.constants';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  email: string;

  @Field(() => Roles)
  role: Roles;
}

@ArgsType()
export class CreateUserArgs {
  @Field(() => CreateUserInput)
  input: CreateUserInput;
}
