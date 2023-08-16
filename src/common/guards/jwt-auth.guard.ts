import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ALLOW_GUEST } from '../../constants/app';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(protected readonly reflector: Reflector) {
        super();
    }
    async canActivate(context: ExecutionContext) {
        // 判断是否需要登录
        if (
            this.reflector.getAllAndOverride(ALLOW_GUEST, [
                context.getHandler(),
                context.getClass(),
            ])
        ) {
            return true;
        }

        return super.canActivate(context) as boolean;
    }
}
