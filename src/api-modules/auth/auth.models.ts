import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class TokensModel {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => String, { nullable: true })
  refreshTokenExpiry?: string;
}
