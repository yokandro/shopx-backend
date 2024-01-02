import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AccountsService } from './accounts.service';
import { Account, AccountSchema } from './accounts.schema-model';
import { AccountsResolver } from './accounts.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }])],
  exports: [AccountsService],
  providers: [AccountsService, AccountsResolver],
})
export class AccountsModule {}
