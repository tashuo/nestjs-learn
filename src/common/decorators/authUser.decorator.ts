import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { IAuthUser } from 'src/interfaces/auth';

type Payload = keyof IAuthUser;

export const AuthUser = createParamDecorator((data: Payload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return data ? request.user?.[data] : request.user;
});
