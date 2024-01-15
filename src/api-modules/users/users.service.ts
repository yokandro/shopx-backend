import { Types } from 'mongoose';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { AccountsService } from 'src/api-modules/accounts/accounts.service';
import { AccountStatuses } from 'src/api-modules/accounts/accounts.constants';
import { getPaginatedPipeline } from 'src/api-modules/common/helpers/pipelines.helpers';

import { INITIAL_SHOPX_USERS, INITIAL_SHOPX_USER_IDS } from './users.constants';
import { CreateUserInput } from './args/create-user.args';
import { User, UserModel, UsersOutput } from './users.schema-model';
import { GetUsersArgs } from './args/get-users.args';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: UserModel,
    private readonly accountsService: AccountsService
  ) {}

  async createUser({ firstName, lastName, ...accountToCreate }: CreateUserInput): Promise<User> {
    const account = await this.accountsService.createAccount({
      ...accountToCreate,
      status: AccountStatuses.INVITED,
    });

    const user = await this.userModel.create({
      firstName,
      lastName,
      accountId: account._id,
    });

    if (!user) {
      throw new Error('User not created');
    }

    return user;
  }

  async getUsers(args: GetUsersArgs): Promise<UsersOutput> {
    const { filter, pagination, sort } = args;
    const { searchTerm = '', statuses = [], roles = [] } = filter || {};

    const [{ collection = [], totalCount = 0 }] = await this.userModel.aggregate([
      {
        $lookup: {
          from: 'accounts',
          localField: 'accountId',
          foreignField: '_id',
          as: 'account',
          pipeline: [
            {
              $match: {
                ...(statuses.length > 0 && { status: { $in: statuses } }),
                ...(roles.length > 0 && { role: { $in: roles } }),
              },
            },
          ],
        },
      },
      { $unwind: { path: '$account', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          searchTerm: { $concat: ['$firstName', ' ', '$lastName', ' ', '$account.email'] },
        },
      },
      {
        $match: {
          searchTerm: { $regex: searchTerm || '', $options: 'i' },
        },
      },
      ...getPaginatedPipeline(sort, pagination),
    ]);

    return {
      collection,
      totalCount,
    };
  }

  async getCurrentUser(accountId: Types.ObjectId): Promise<User> {
    return this.userModel.findOne({ accountId });
  }

  async onModuleInit() {
    const users = await this.userModel.find({
      _id: { $in: INITIAL_SHOPX_USER_IDS },
    });

    if (users.length !== INITIAL_SHOPX_USERS.length) {
      await Promise.all(
        INITIAL_SHOPX_USERS.map(async ({ firstName, lastName, _id: userId, ...userAccount }) => {
          const account = await this.accountsService.createAccount(userAccount);

          return this.userModel.create({
            _id: userId,
            firstName,
            lastName,
            accountId: account._id,
          });
        })
      );
    }
  }
}
