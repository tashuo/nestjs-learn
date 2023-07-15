import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Inject,
    Query,
    Req,
} from '@nestjs/common';
import { isNil } from 'lodash';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AuthUser } from 'src/common/decorators/authUser.decorator';
import { BaseController } from 'src/common/base/controller.base';
import { ApiExtraModels } from '@nestjs/swagger';
import { PostEntity } from './entities/post.entity';
import { CommonResponseDto } from './dto/common-response.dto';
import { Guest } from 'src/common/decorators/guest.decorator';
import { GenerateSwaggerResponse } from 'src/common/decorators/response.decorator';
import { CustomBaseResponse } from 'src/common/base/response.dto';
import { LikeDto, UnlikeDto } from './dto/like.dto';
import { UserEntity } from '../user/entities/user.entity';
import { LikeService } from './like.service';
import { CollectEntity } from '../collect/entities/collect.entity';
import { CancelPostCollectDto, PostCollectDto } from './dto/collect.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostDeletedEvent } from './events/postDeleted.event';
import { PaginateDto } from 'src/common/base/paginate.dto';
import { ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { IAuthUser } from 'src/interfaces/auth';

@Controller('post')
export class PostController extends BaseController {
    constructor(
        private readonly postService: PostService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly likeService: LikeService,
        protected readonly eventEmitter: EventEmitter2,
        protected readonly jwtService: JwtService,
    ) {
        super();
    }

    @ApiExtraModels(PostEntity)
    @GenerateSwaggerResponse(PostEntity, 'single')
    @Post()
    async create(
        @AuthUser() user,
        @Body() createPostDto: CreatePostDto,
    ): Promise<CustomBaseResponse<PostEntity>> {
        return this.successResponse(await this.postService.create(createPostDto, user));
    }

    @GenerateSwaggerResponse(PostEntity, 'page')
    @Guest()
    @Get()
    async findAll(
        @Query() pageDto: PaginateDto,
        @Req() request: any,
    ): Promise<CustomBaseResponse<PostEntity>> {
        const requestToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request) as string;
        const decodeToken = this.jwtService.decode(requestToken);
        console.log(decodeToken);
        return this.successResponse(
            await this.postService.findAll(
                (decodeToken as any)?.userId,
                pageDto.page,
                pageDto.limit,
            ),
        );
    }

    @GenerateSwaggerResponse(PostEntity, 'single')
    @Guest()
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<CommonResponseDto<PostEntity>> {
        return this.successResponse(await this.postService.findOne(+id));
    }

    @Patch(':id')
    async update(
        @Param('id') id: number,
        @Body() updatePostDto: UpdatePostDto,
        @AuthUser() user: IAuthUser,
    ) {
        const post = await PostEntity.findOne({ where: { id }, relations: ['user'] });
        if (isNil(post) || post.user.id !== user.userId) {
            return this.failedResponse();
        }
        return this.postService.update(post, updatePostDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number, @AuthUser() user: IAuthUser) {
        const post = await PostEntity.findOne({ where: { id }, relations: ['user'] });
        if (isNil(post) || post.user.id !== user.userId) {
            return this.failedResponse();
        }
        PostEntity.createQueryBuilder().softDelete().where('id = :id', { id }).execute();
        this.eventEmitter.emit(
            'post.delete',
            new PostDeletedEvent({
                userId: user.userId,
                postId: post.id,
            }),
        );
        return this.successResponse();
    }

    @Post('like')
    async like(@Body() data: LikeDto, @AuthUser() user: IAuthUser) {
        console.log(user);
        return this.successResponse(
            await this.likeService.like(await UserEntity.findOneBy({ id: user.userId }), data.post),
        );
    }

    @Post('cancelLike')
    async cancelLike(@Body() data: UnlikeDto, @AuthUser() user: IAuthUser) {
        console.log(user);
        return this.successResponse(await this.likeService.cancelLike(user.userId, data.post));
    }

    @Post('collect')
    async collect(@Body() data: PostCollectDto, @AuthUser() user: IAuthUser) {
        const collect = await CollectEntity.findOne({
            where: { id: data.collect },
            relations: ['user'],
        });
        if (isNil(collect) || collect.user.id !== user.userId) {
            return this.failedResponse();
        }
        const post = await PostEntity.findOneBy({ id: data.post });
        if (isNil(post)) {
            return this.failedResponse();
        }
        return this.successResponse(await this.postService.collect(post, collect, data.remark));
    }

    @Post('cancelCollect')
    async cancelCollect(@Body() data: CancelPostCollectDto, @AuthUser() user: IAuthUser) {
        const collect = await CollectEntity.findOne({
            where: { id: data.collect },
            relations: ['user'],
        });
        if (isNil(collect) || collect.user.id !== user.userId) {
            return this.failedResponse();
        }
        const post = await PostEntity.findOneBy({ id: data.post });
        if (isNil(post)) {
            return this.failedResponse();
        }
        return this.successResponse(await this.postService.cancleCollect(post, collect));
    }
}
