import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@InputType()
export class UpdateProductInput {
  @Field(() => Types.ObjectId)
  productId: Types.ObjectId;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => Types.ObjectId, { nullable: true })
  categoryId?: Types.ObjectId;

  @Field(() => Number)
  price: number;
}

@ArgsType()
export class UpdateProductArgs {
  @Field(() => UpdateProductInput)
  input: UpdateProductInput;
}
