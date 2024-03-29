import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentAccount = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user;
  }

  const ctx = GqlExecutionContext.create(context);

  return ctx.getContext().user;
});
