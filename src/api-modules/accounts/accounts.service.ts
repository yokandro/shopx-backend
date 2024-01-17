import { FilterQuery, Types } from 'mongoose';
import bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Account, AccountModel } from './accounts.schema-model';
import { CreateAccountType } from './types/create-account.type';
import { AccountStatuses } from './accounts.constants';

@Injectable()
export class AccountsService {
  constructor(@InjectModel(Account.name) private readonly accountModel: AccountModel) {}

  async createAccount(args: CreateAccountType): Promise<Account> {
    const { password, ...accountToCreate } = args;

    const account = await this.accountModel.findOne({ email: args.email });

    if (account) {
      throw new Error('Account already exists');
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      return this.accountModel.create({ ...accountToCreate, hashedPassword });
    }

    return this.accountModel.create(accountToCreate);
  }

  async deleteAccount(accountId: Types.ObjectId): Promise<boolean> {
    return !!(await this.accountModel.findByIdAndDelete(accountId));
  }

  async getAccountsByQuery(query: FilterQuery<Account>): Promise<Account[]> {
    return this.accountModel.find(query);
  }

  async getAccountById(id: Types.ObjectId): Promise<Account> {
    const account = await this.accountModel.findById(id);

    if (!account) {
      throw new Error('ACCOUNT_NOT_FOUND');
    }

    return account;
  }

  async getAccountByEmail(email: string): Promise<Account> {
    const account = await this.accountModel.findOne({ email });

    if (!account) {
      throw new Error('ACCOUNT_NOT_FOUND');
    }

    return account;
  }

  async getAccountByRefreshToken(refreshToken: string, email: string): Promise<Account> {
    const account = await this.getAccountByEmail(email);

    if (account) {
      const isTokenMatching = await bcrypt.compare(refreshToken, account.hashedRefreshToken || '');

      if (isTokenMatching) {
        return account;
      }
    }

    return null;
  }

  public async setAccountHashedPassword(
    password: string,
    accountId: Types.ObjectId
  ): Promise<Account> {
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.accountModel.findByIdAndUpdate(
      accountId,
      { $set: { hashedPassword, status: AccountStatuses.ACTIVE } },
      { new: true }
    );
  }

  public async setCurrentRefreshToken(
    refreshToken: string | null,
    accountId: Types.ObjectId
  ): Promise<boolean> {
    const hashedRefreshToken = refreshToken && (await bcrypt.hash(refreshToken, 10));

    const { _id } =
      (await this.accountModel.findOneAndUpdate(accountId, { hashedRefreshToken })) || {};

    return !!_id;
  }
}
