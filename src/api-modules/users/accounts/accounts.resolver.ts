import { Args, Query, Resolver } from '@nestjs/graphql';

import { Account } from './accounts.schema-model';
import { AccountsService } from './accounts.service';

@Resolver()
export class AccountsResolver {
  constructor(private readonly accountService: AccountsService) {}

  @Query(() => Account)
  async getAccountById(@Args('id') id: string): Promise<Account> {
    return this.accountService.getAccountById(id);
  }
}
