import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { Guest } from 'src/auth/guest.decorator';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Guest()
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

    @Post('register')
    async register(@Body() createDto: CreateUserDto) {
        return this.userService.register(createDto);
    }

    @UseGuards(LocalAuthGuard)
    // @Guest()
    @Post('login')
    async login(@Req() req) {
        console.log('123');
        return this.authService.login(req.user);
    }

    // @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    async profile(@Req() req) {
        return req.user;
    }
}
