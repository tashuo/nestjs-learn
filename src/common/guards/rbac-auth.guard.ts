import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { isNil } from 'lodash';
import { AuthGuard } from '@nestjs/passport';
import { ALLOW_GUEST } from '../../constants/app';
import { shouldCheckRbacAuth } from 'src/utils/helper';
import { AdminService } from 'src/modules/admin/admin.service';

@Injectable()
export class RbacGuard extends AuthGuard('jwt') {
    constructor(
        protected readonly reflector: Reflector,
        protected readonly adminService: AdminService,
    ) {
        super(reflector);
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

        // jwt
        const jwtAuthResult = (await super.canActivate(context)) as boolean;
        if (!jwtAuthResult) {
            return false;
        }

        // rbac
        const request: Request = context.switchToHttp().getRequest();
        if (!shouldCheckRbacAuth(request)) {
            return true;
        }
        if (isNil(request.user)) {
            return false;
        }
        return this.adminService.canUserActivate(request.user.userId, request);
    }
}
