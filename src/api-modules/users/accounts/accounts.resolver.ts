import { Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { CurrentAccount } from 'src/api-modules/auth/auth.decorators';
import { AccessTokenGuard } from 'src/api-modules/auth/guards/access-token.guard';

import { Account } from './accounts.schema-model';
import { AccountsService } from './accounts.service';

@Resolver()
export class AccountsResolver {
  constructor(private readonly accountService: AccountsService) {}

  @Query(() => Account)
  @UseGuards(AccessTokenGuard)
  async getCurrentAccount(@CurrentAccount() account: Account): Promise<Account> {
    return this.accountService.getAccountById(account._id);
  }
}
