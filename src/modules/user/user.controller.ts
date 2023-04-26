import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Guest } from '../../common/decorators/guest.decorator';
import { User } from '../../common/decorators/user.decorator';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { FollowDto, QueryFollowersDto, QueryFollowingsDto, UnfollowDto } from './dto/follow.dto';
import { UserEntity } from './entities/user.entity';
import { BaseController } from '../../common/base/controller.base';

@Controller('user')
export class UserController extends BaseController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {
        super();
    }

    @Post('register')
    async register(@Body() createDto: CreateUserDto) {
        return this.successResponse(await this.userService.register(createDto));
    }

    @UseGuards(LocalAuthGuard)
    @Guest()
    @Post('login')
    async login(@Req() req) {
        return this.successResponse(await this.authService.login(req.user));
    }

    @Get('profile')
    async profile(@Req() req) {
        return this.successResponse(await this.userService.detail(req.user.id));
    }

    @Post('follow')
    async follow(@Body() followDto: FollowDto, @User() user: UserEntity) {
        return this.successResponse(await this.userService.follow(user, followDto.userId));
    }

    @Post('unfollow')
    async unfollow(@Body() followDto: UnfollowDto, @User() user: UserEntity) {
        return this.successResponse(await this.userService.unfollow(user, followDto.userId));
    }

    @Get('followings')
    async followings(@Query() data: QueryFollowingsDto, @User() user: UserEntity) {
        const response = await this.userService.getFollowings(user, data.page, data.limit);
        return this.successResponse(response);
    }

    @Get('followers')
    async followers(@Query() data: QueryFollowersDto, @User() user: UserEntity) {
        const response = await this.userService.getFollowers(user, data.page, data.limit);
        return this.successResponse(response);
    }
}
