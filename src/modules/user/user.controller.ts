import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Guest } from '../../common/decorators/guest.decorator';
import { AuthUser } from '../../common/decorators/authUser.decorator';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { FollowDto, QueryFollowersDto, QueryFollowingsDto, UnfollowDto } from './dto/follow.dto';
import { UserEntity } from './entities/user.entity';
import { BaseController } from '../../common/base/controller.base';
import { FollowService } from './follow.service';
import { Test } from 'src/common/decorators/test.decorator';

@Controller('user')
export class UserController extends BaseController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly followService: FollowService,
    ) {
        super();
    }

    @Guest()
    @Test()
    @Post('register')
    async register(@Body() createDto: CreateUserDto) {
        Test()(
            UserController.prototype,
            'login',
            Object.getOwnPropertyDescriptor(UserController.prototype, 'login'),
        );
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
    async follow(@Body() followDto: FollowDto, @AuthUser() user: UserEntity) {
        return this.successResponse(await this.followService.follow(user, followDto.userId));
    }

    @Post('unfollow')
    async unfollow(@Body() followDto: UnfollowDto, @AuthUser() user: UserEntity) {
        return this.successResponse(await this.followService.unfollow(user, followDto.userId));
    }

    @Get('followings')
    async followings(@Query() data: QueryFollowingsDto, @AuthUser() user: UserEntity) {
        const response = await this.followService.getFollowings(user, data.page, data.limit);
        return this.successResponse(response);
    }

    @Get('followers')
    async followers(@Query() data: QueryFollowersDto, @AuthUser() user: UserEntity) {
        const response = await this.followService.getFollowers(user, data.page, data.limit);
        return this.successResponse(response);
    }
}
