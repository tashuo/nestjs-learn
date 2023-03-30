import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Guest } from 'src/common/decorators/guest.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

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
        return this.authService.login(req.user);
    }

    // @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    async profile(@Req() req) {
        console.log(11);
        return this.userService.detail(req.user.id);
    }

    @Post('follow')
    async follow(@Req() req) {
        return await this.userService.follow(req.user, 5);
    }
}
