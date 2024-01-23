import { Types } from 'mongoose';

import { Args, Query, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AccessTokenGuard } from 'src/api-modules/auth/guards/access-token.guard';
import { Account } from 'src/api-modules/accounts/accounts.schema-model';
import { AccountsService } from 'src/api-modules/accounts/accounts.service';
import { CurrentAccount } from 'src/api-modules/auth/auth.decorators';

import { User, UsersOutput } from './users.schema-model';
import { UserService } from './users.service';
import { CreateUserArgs } from './args/create-user.args';
import { GetUsersArgs } from './args/get-users.args';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UserService,
    private readonly accountService: AccountsService
  ) {}

  @Query(() => UsersOutput)
  @UseGuards(AccessTokenGuard)
  async getUsers(@Args({ type: () => GetUsersArgs }) args: GetUsersArgs): Promise<UsersOutput> {
    return this.usersService.getUsers(args);
  }

  @Query(() => User)
  @UseGuards(AccessTokenGuard)
  async getCurrentUser(@CurrentAccount() account: Account): Promise<User> {
    return this.usersService.getCurrentUser(account._id);
  }

  @Mutation(() => User)
  @UseGuards(AccessTokenGuard)
  async createUser(@Args({ type: () => CreateUserArgs }) args: CreateUserArgs): Promise<User> {
    return this.usersService.createUser(args.input);
  }

  @Mutation(() => User)
  @UseGuards(AccessTokenGuard)
  async resendUserInvitationEmail(@Args('userId') userId: Types.ObjectId): Promise<User> {
    return this.usersService.sendUserInvitationEmail(userId);
  }

  @Mutation(() => Boolean)
  @UseGuards(AccessTokenGuard)
  async deleteUser(
    @Args('userId') userId: Types.ObjectId,
    @CurrentAccount() account: Account
  ): Promise<boolean> {
    return this.usersService.deleteUser(userId, account);
  }

  @ResolveField(() => Account)
  async account(@Parent() user: User): Promise<Account> {
    return this.accountService.getAccountById(user.accountId);
  }
}
