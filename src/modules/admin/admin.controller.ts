import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { BaseController } from 'src/common/base/controller.base';
import { AdminService } from './admin.service';
import { AuthUser } from 'src/common/decorators/authUser.decorator';
import { IAuthUser } from 'src/interfaces/auth';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/common/guards/admin-auth.guard';
import { LoginDto } from './dto/login.dto';
import { Guest } from 'src/common/decorators/guest.decorator';
import { UsersDto } from './dto/user.dto';
import { PostDto } from './dto/post.dto';

@ApiBearerAuth()
@ApiTags('管理后台')
@Controller('admin')
export class AdminController extends BaseController {
    constructor(private readonly service: AdminService) {
        super();
    }

    @Guest()
    @UseGuards(AdminAuthGuard)
    @Post('login')
    async login(@Req() req: any, @Body() _data: LoginDto) {
        return this.successResponse(await this.service.login(req.user));
    }

    @Get('profile')
    async info(@AuthUser() user: IAuthUser) {
        return this.successResponse(await this.service.getProfile(user.userId));
    }

    @Get('users')
    async users(@Query() query: UsersDto) {
        return this.service.getUsers(query);
    }

    @Get('posts')
    async posts(@Query() query: PostDto) {
        return this.service.getPosts(query);
    }
}
