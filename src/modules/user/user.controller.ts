import {
    Body,
    Controller,
    FileTypeValidator,
    Get,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    Post,
    Query,
    Req,
    SerializeOptions,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
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
import { ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { IAuthUser } from 'src/interfaces/auth';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { GithubLoginDto, LoginDto } from './dto/login.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { uploadClientFile, uploadClientFiles } from 'src/utils/helper';

@ApiBearerAuth()
@ApiTags('用户')
@Controller('user')
export class UserController extends BaseController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly followService: FollowService,
        private readonly jwtService: JwtService,
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
    async login(@Req() req: any, @Body() _data: LoginDto) {
        return this.successResponse(await this.authService.login(req.user));
    }

    @Guest()
    @Post('githubLogin')
    async githubLogin(@Body() data: GithubLoginDto) {
        return this.successResponse(await this.authService.githubLogin(data.code));
    }

    @SerializeOptions({
        groups: ['user-detail'],
    })
    @Get('profile')
    async profile(@AuthUser() user: IAuthUser) {
        return this.successResponse(await this.userService.detail(user.userId));
    }

    @SerializeOptions({
        groups: ['user-detail'],
    })
    @Guest()
    @Get('profile/:id')
    async findOne(@Param('id') id: number, @Req() request: any) {
        const requestToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request) as string;
        const decodeToken = this.jwtService.decode(requestToken);
        console.log(decodeToken);
        return this.successResponse(
            await this.userService.detail(+id, (decodeToken as any)?.userId),
        );
    }

    @Guest()
    @Get('/all')
    async getAllUserIds() {
        return this.successResponse(
            (await UserEntity.createQueryBuilder().select('id').getRawMany()).map(
                (v: UserEntity) => v.id,
            ),
        );
    }

    @Post('follow')
    async follow(@Body() followDto: FollowDto, @AuthUser() user: IAuthUser) {
        return this.successResponse(
            await this.followService.follow(
                await UserEntity.findOneBy({ id: user.userId }),
                followDto.userId,
            ),
        );
    }

    @Post('unfollow')
    async unfollow(@Body() followDto: UnfollowDto, @AuthUser() user: IAuthUser) {
        return this.successResponse(
            await this.followService.unfollow(
                await UserEntity.findOneBy({ id: user.userId }),
                followDto.userId,
            ),
        );
    }

    @Get('followings')
    async followings(@Query() data: QueryFollowingsDto, @AuthUser() user: IAuthUser) {
        const response = await this.followService.getFollowings(user.userId, data.page, data.limit);
        return this.successResponse(response);
    }

    @Get('followers')
    async followers(@Query() data: QueryFollowersDto, @AuthUser() user: IAuthUser) {
        const response = await this.followService.getFollowers(user.userId, data.page, data.limit);
        return this.successResponse(response);
    }

    @Post('uploadMulti')
    @UseInterceptors(FilesInterceptor('files', 9))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    })
    async uploadFileMulti(
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1000 * 1000 }),
                    new FileTypeValidator({ fileType: 'image/*' }),
                ],
            }),
        )
        files: Express.Multer.File[],
        @AuthUser() user: IAuthUser,
    ) {
        return this.successResponse(await uploadClientFiles(user.userId, files));
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    async uploadFile(
        @UploadedFile(
            'file',
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1000 * 1000 }),
                    new FileTypeValidator({ fileType: 'image/*' }),
                ],
            }),
        )
        file: Express.Multer.File,
        @AuthUser() user: IAuthUser,
    ) {
        return this.successResponse(await uploadClientFile(user.userId, file));
    }
}
