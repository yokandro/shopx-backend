import { ArgsType, Field, InputType } from '@nestjs/graphql';

@InputType()
export class PaginationInput {
  @Field(() => Number, { defaultValue: 10 })
  limit: number;

  @Field(() => Number, { defaultValue: 0 })
  skip: number;
}

@InputType()
export class SortInput {
  @Field(() => String, { nullable: true })
  sortBy?: string;

  @Field(() => Number, { nullable: true })
  sortOrder?: number;
}

@ArgsType()
export class PaginationArgs {
  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;
}

@ArgsType()
export class SortArgs {
  @Field(() => SortInput, { nullable: true })
  sort?: SortInput;
}

@ArgsType()
export class CommonArgs {
  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;

  @Field(() => SortInput, { nullable: true })
  sort?: SortInput;
}
