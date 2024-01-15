import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AccountsModule } from 'src/api-modules/accounts/accounts.module';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { EmailPasswordStrategy } from './strategies';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [AccountsModule, JwtModule],
  providers: [
    AuthService,
    AuthResolver,
    EmailPasswordStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
