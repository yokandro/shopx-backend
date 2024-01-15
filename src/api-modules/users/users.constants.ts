import { Types } from 'mongoose';

import { AccountStatuses, Roles } from 'src/api-modules/accounts/accounts.constants';

export const INITIAL_SHOPX_USERS = [
  {
    _id: new Types.ObjectId('61aa43094394d54ce7c7f581'),
    firstName: 'Test',
    lastName: 'User',
    email: 'test@shopx.com',
    password: 'test1234',
    status: AccountStatuses.ACTIVE,
    role: Roles.ADMIN,
  },
];

export const INITIAL_SHOPX_USER_IDS = INITIAL_SHOPX_USERS.map(user => user._id);
