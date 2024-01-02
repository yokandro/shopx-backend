import { Types } from 'mongoose';

export type CreateAccountType = {
  _id?: Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};
