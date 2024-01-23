import { Types } from 'mongoose';

import { JwtService } from '@nestjs/jwt';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { AccountsService } from 'src/api-modules/accounts/accounts.service';
import { AccountStatuses } from 'src/api-modules/accounts/accounts.constants';
import { getPaginatedPipeline } from 'src/api-modules/common/helpers/pipelines.helpers';
import { EmailService } from 'src/utility-modules/email/email.service';
import { Account } from 'src/api-modules/accounts/accounts.schema-model';

import { INITIAL_SHOPX_USERS, INITIAL_SHOPX_USER_IDS } from './users.constants';
import { CreateUserInput } from './args/create-user.args';
import { User, UserModel, UsersOutput } from './users.schema-model';
import { GetUsersArgs } from './args/get-users.args';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: UserModel,
    private readonly accountsService: AccountsService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService
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

    await this.sendUserInvitationEmail(user._id);

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

  async deleteUser(userId: Types.ObjectId, account: Account): Promise<boolean> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (account._id.equals(user.accountId)) {
      throw new Error('You cannot delete own account');
    }

    await this.accountsService.deleteAccount(user.accountId);

    return this.userModel.deleteOne({ _id: userId }).then(({ deletedCount }) => !!deletedCount);
  }

  async sendUserInvitationEmail(userId: Types.ObjectId): Promise<User> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const account = await this.accountsService.getAccountById(user.accountId);

    const payload = { email: account.email, sub: account._id };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_SECRET_TIME,
    });

    await this.emailService.sendEmail(`${process.env.ORIGIN_URL}/auth/login?token=${token}`);

    return user;
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
