import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class AccessTokenGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): any {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext();

    request.headers = request.req.headers;

    const tokenSource = request.req.query || request.headers;
    const accessToken = tokenSource['accessToken'];

    if (!request.headers.authorization && accessToken) {
      request.headers['authorization'] = `Bearer ${accessToken}`;
    }

    return request;
  }
}
