import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserType } from '../types/current-user.type';

type RequestWithUser = {
  user: CurrentUserType;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserType => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  }
);
