import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { Account } from 'src/api-modules/users/accounts/accounts.schema-model';

import { EmailPasswordGuard } from './guards';
import { CurrentAccount } from './auth.decorators';
import { AuthService } from './auth.service';
import { TokensModel } from './auth.models';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => TokensModel)
  @UseGuards(EmailPasswordGuard)
  async login(
    @CurrentAccount() account: Account,
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<TokensModel> {
    return this.authService.refreshJwtTokens(account);
  }

  @Mutation(() => TokensModel)
  @UseGuards(RefreshTokenGuard)
  async refreshTokens(@CurrentAccount() account: Account): Promise<TokensModel> {
    return this.authService.refreshJwtTokens(account);
  }
}
