import { Types } from 'mongoose';

import { ArgsType, Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Types.ObjectId)
  categoryId: Types.ObjectId;

  @Field(() => Number)
  price: number;
}

@ArgsType()
export class CreateProductArgs {
  @Field(() => CreateProductInput)
  input: CreateProductInput;
}
