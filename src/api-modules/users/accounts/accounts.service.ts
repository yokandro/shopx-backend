import { Types } from 'mongoose';
import bcrypt from 'bcrypt';

import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Account, AccountModel } from './accounts.schema-model';
import { CreateAccountType } from './types/create-account.type';
import { INITIAL_SHOPX_ACCOUNTS, INITIAL_SHOPX_ACCOUNTS_IDS } from './accounts.constants';

@Injectable()
export class AccountsService implements OnModuleInit {
  private readonly accountModel: AccountModel;

  constructor(@InjectModel(Account.name) accountModel: AccountModel) {
    this.accountModel = accountModel;
  }

  async createAccount(args: CreateAccountType): Promise<Account> {
    const { password, ...accountToCreate } = args;

    const account = await this.accountModel.findOne({ email: args.email });

    if (account) {
      throw new Error('Account already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.accountModel.create({ ...accountToCreate, hashedPassword });
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

  public async setCurrentRefreshToken(
    refreshToken: string | null,
    accountId: Types.ObjectId
  ): Promise<boolean> {
    const hashedRefreshToken = refreshToken && (await bcrypt.hash(refreshToken, 10));

    const { _id } =
      (await this.accountModel.findOneAndUpdate(accountId, { hashedRefreshToken })) || {};

    return !!_id;
  }

  async onModuleInit() {
    const accounts = await this.accountModel.find({ _id: { $in: INITIAL_SHOPX_ACCOUNTS_IDS } });

    if (accounts.length !== INITIAL_SHOPX_ACCOUNTS.length) {
      await Promise.all(
        INITIAL_SHOPX_ACCOUNTS.map(async account => {
          return this.createAccount(account);
        })
      );
    }
  }
}
