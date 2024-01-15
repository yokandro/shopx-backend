import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Account } from 'src/api-modules/accounts/accounts.schema-model';
import { AccountsService } from 'src/api-modules/accounts/accounts.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(private readonly accountsService: AccountsService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromHeader('refresh')]),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request & { headers: any }, payload: Account) {
    const refreshToken = request.headers.refresh || '';

    return this.accountsService.getAccountByRefreshToken(refreshToken, payload.email);
  }
}
