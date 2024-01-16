import { Types } from 'mongoose';
import { ArgsType, Field, InputType } from '@nestjs/graphql';

@InputType()
export class ChangeProductStatusInput {
  @Field(() => Types.ObjectId)
  productId: Types.ObjectId;

  @Field(() => String)
  status: string;
}

@ArgsType()
export class ChangeProductStatusArgs {
  @Field(() => ChangeProductStatusInput)
  input: ChangeProductStatusInput;
}
