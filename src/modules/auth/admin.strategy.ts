import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AdminService } from '../admin/admin.service';
import { isNil } from 'lodash';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
    constructor(private readonly adminService: AdminService) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        const admin = await this.adminService.validateUser(username, password);
        console.log(username, password, admin);
        if (isNil(admin)) {
            throw new UnauthorizedException();
        }
        return admin;
    }
}
