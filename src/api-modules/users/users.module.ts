import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AccountsModule } from 'src/api-modules/accounts/accounts.module';

import { User, UserSchema } from './users.schema-model';
import { UserService } from './users.service';
import { UsersResolver } from './Users.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), AccountsModule],
  exports: [],
  providers: [UserService, UsersResolver],
})
export class UsersModule {}
