import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  name: string;

  @Field(() => Types.ObjectId, { nullable: true })
  parentCategoryId?: Types.ObjectId;

  @Field(() => String, { nullable: true })
  description?: string;
}

@ArgsType()
export class CreateCategoryArgs {
  @Field(() => CreateCategoryInput)
  input: CreateCategoryInput;
}
