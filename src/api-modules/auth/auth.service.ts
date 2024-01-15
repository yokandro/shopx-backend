import bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AccountsService } from 'src/api-modules/accounts/accounts.service';
import { Account } from 'src/api-modules/accounts/accounts.schema-model';

import { TokensModel } from './auth.models';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly jwtService: JwtService
  ) {}

  public getJwtAccessToken(account: Account): string {
    const payload = { email: account.email, sub: account._id };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_SECRET_TIME,
    });
  }

  public getJwtRefreshToken(account: Account): string {
    const payload = { email: account.email, sub: account._id };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_SECRET_TIME,
    });
  }

  async validate(email: string, password: string): Promise<Account> | null {
    const account = await this.accountsService.getAccountByEmail(email);

    const { hashedPassword } = account;

    const passwordIsValid = await bcrypt.compare(password, hashedPassword);

    if (!passwordIsValid) {
      throw new Error('INCORRECT_PASSWORD');
    }

    return account;
  }

  async refreshJwtTokens(account: Account): Promise<TokensModel> {
    const accessToken = this.getJwtAccessToken(account);
    const refreshToken = this.getJwtRefreshToken(account);

    await this.accountsService.setCurrentRefreshToken(refreshToken, account._id);

    return { accessToken, refreshToken, refreshTokenExpiry: process.env.JWT_REFRESH_SECRET_TIME };
  }
}
