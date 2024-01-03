import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh-token') {
  getRequest(context: ExecutionContext): any {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext();

    request.headers = ctx.getContext().req.headers;

    return request;
  }
}
