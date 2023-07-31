import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { BaseController } from '../../common/base/controller.base';
import { AuthUser } from '../../common/decorators/authUser.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { CommentEntity } from './entities/comment.entity';
import { isNil } from 'lodash';
import { PostEntity } from '../post/entities/post.entity';
import { QueryChildrenCommentDto, QueryPostCommentDto } from './dto/query-comment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IAuthUser } from 'src/interfaces/auth';
import { Guest } from 'src/common/decorators/guest.decorator';
import { LikeDto, UnlikeDto } from './dto/like.dto';
import { LikeService } from '../post/like.service';
import { ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';

@ApiBearerAuth()
@ApiTags('评论')
@Controller('comment')
export class CommentController extends BaseController {
    constructor(
        private readonly commentService: CommentService,
        private readonly likeService: LikeService,
        private readonly jwtService: JwtService,
    ) {
        super();
    }

    @Post()
    async create(@Body() createCommentDto: CreateCommentDto, @AuthUser() user: IAuthUser) {
        const post = await PostEntity.findOneBy({ id: createCommentDto.post });
        if (isNil(post)) {
            return this.failedResponse();
        }
        const parent = createCommentDto.parent
            ? await CommentEntity.findOneBy({ id: createCommentDto.parent })
            : null;
        const comment = await this.commentService.create(
            await UserEntity.findOneBy({ id: user.userId }),
            post,
            createCommentDto.content,
            parent,
        );
        return this.successResponse(
            (await this.commentService.renderCommentInfo([comment], user.userId))[0],
        );
    }

    @Get()
    @Guest()
    async findAll(@Query() queryDto: QueryPostCommentDto, @Req() request: any) {
        const post = await PostEntity.findOneBy({ id: queryDto.post });
        if (isNil(post)) {
            return this.failedResponse();
        }

        const requestToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request) as string;
        const decodeToken = this.jwtService.decode(requestToken);
        return this.successResponse(
            await this.commentService.getPostComments(
                post,
                (decodeToken as any)?.userId,
                queryDto.cursor || 0,
                queryDto.limit,
            ),
        );
    }

    @Get('children')
    @Guest()
    async getChildren(@Query() queryDto: QueryChildrenCommentDto, @Req() request: any) {
        const parent = await CommentEntity.findOneBy({ id: queryDto.parent });
        if (isNil(parent)) {
            return this.failedResponse();
        }
        const requestToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request) as string;
        const decodeToken = this.jwtService.decode(requestToken);
        return this.successResponse(
            await this.commentService.getChildrenComments(
                parent,
                (decodeToken as any)?.userId,
                queryDto.cursor || 0,
                queryDto.limit,
            ),
        );
    }

    @Post('like')
    async like(@Body() data: LikeDto, @AuthUser() user: IAuthUser) {
        console.log(user);
        return this.successResponse(
            await this.likeService.likeComment(
                await UserEntity.findOneBy({ id: user.userId }),
                data.comment,
            ),
        );
    }

    @Post('cancelLike')
    async cancelLike(@Body() data: UnlikeDto, @AuthUser() user: IAuthUser) {
        console.log(user);
        return this.successResponse(
            await this.likeService.cancelLikeComment(user.userId, data.comment),
        );
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
        return this.commentService.update(+id, updateCommentDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number, @AuthUser() user: IAuthUser) {
        const comment = await CommentEntity.findOne({ where: { id }, relations: ['user', 'post'] });
        if (isNil(comment) || comment.user.id !== user.userId) {
            return this.failedResponse();
        }
        return this.successResponse(await this.commentService.remove(comment));
    }
}
