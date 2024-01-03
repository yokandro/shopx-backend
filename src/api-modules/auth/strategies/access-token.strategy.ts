import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Account } from 'src/api-modules/users/accounts/accounts.schema-model';
import { AccountsService } from 'src/api-modules/users/accounts/accounts.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly accountsService: AccountsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(validationPayload: { email: string }): Promise<Account> | null {
    const account = await this.accountsService.getAccountByEmail(validationPayload.email);

    if (!account) {
      throw new UnauthorizedException();
    }

    return account;
  }
}
