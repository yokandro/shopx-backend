import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AccountsModule } from 'src/api-modules/users/accounts/accounts.module';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { EmailPasswordStrategy } from './strategies';

@Module({
  imports: [AccountsModule, JwtModule],
  providers: [AuthService, EmailPasswordStrategy, AuthResolver],
})
export class AuthModule {}
