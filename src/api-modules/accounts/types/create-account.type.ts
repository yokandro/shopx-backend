import { Types } from 'mongoose';

import { AccountStatuses, Roles } from 'src/api-modules/accounts/accounts.constants';

export type CreateAccountType = {
  _id?: Types.ObjectId;
  email: string;
  password?: string;
  role: Roles;
  status: AccountStatuses;
};
