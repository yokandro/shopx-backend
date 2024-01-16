import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@InputType()
export class UpdateCategoryInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Types.ObjectId, { nullable: true })
  parentCategoryId?: Types.ObjectId;

  @Field(() => Types.ObjectId)
  categoryId: Types.ObjectId;

  @Field(() => String, { nullable: true })
  description?: string;
}

@ArgsType()
export class UpdateCategoryArgs {
  @Field(() => UpdateCategoryInput)
  input: UpdateCategoryInput;
}
