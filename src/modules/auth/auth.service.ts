import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GithubUser, UserService } from '../user/user.service';
import { IAuthUser } from 'src/interfaces/auth';
import fetch from 'node-fetch';
import { UserEntity } from '../user/entities/user.entity';
import { isNil } from 'lodash';

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
        console.log(payload);
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async githubLogin(code: string) {
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: 'f3e116f0acc1830a0319',
                client_secret: '989b9452d3c74922430ee527b6867a5b536b5257',
                code,
            }),
        });
        const tokenResponseText = await tokenResponse.text();
        console.log(tokenResponseText);
        const params = new URLSearchParams(tokenResponseText);
        const access_token = params.get('access_token');
        console.log(access_token);
        if (isNil(access_token)) {
            return {
                access_token: '',
            };
        }
        const userResponse = await fetch(`https://api.github.com/user`, {
            headers: {
                Authorization: `token ${access_token}`,
            },
        });
        const userResponseData: GithubUser = await userResponse.json();
        console.log(userResponseData);
        const user = await this.userService.registerAndGetGithubUser(userResponseData);
        const response = await this.login(user);
        console.log(response);
        return response;
    }
}
