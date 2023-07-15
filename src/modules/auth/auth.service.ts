import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { IAuthUser } from 'src/interfaces/auth';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string) {
        const user = this.userService.login({ username: username, password: password });
        return user ? user : null;
    }

    async login(user: any) {
        const payload: IAuthUser = { username: user.username, userId: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
