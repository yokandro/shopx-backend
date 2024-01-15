import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { AuthService } from 'src/api-modules/auth/auth.service';
import { Account } from 'src/api-modules/accounts/accounts.schema-model';

@Injectable()
export class EmailPasswordStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passReqToCallback: true });
  }

  async validate({ body }: { body: { email: string; password: string } }): Promise<Account> {
    const { email, password } = body;

    return this.authService
      .validate(email, password)
      .then(data => data)
      .catch(error => {
        throw new HttpException(
          error || 'INCORRECT_ACCOUNT_CREDENTIALS',
          HttpStatus.NOT_ACCEPTABLE
        );
      });
  }
}
