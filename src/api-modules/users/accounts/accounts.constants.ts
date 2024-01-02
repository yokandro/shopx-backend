import { Types } from 'mongoose';

export const INITIAL_SHOPX_ACCOUNTS = [
  {
    _id: new Types.ObjectId('61aa43094394d54ce7c7f581'),
    email: 'test@shopx.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'test1234',
  },
];

export const INITIAL_SHOPX_ACCOUNTS_IDS = INITIAL_SHOPX_ACCOUNTS.map(account => account._id);
