import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
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

@Controller('comment')
export class CommentController extends BaseController {
    constructor(private readonly commentService: CommentService) {
        super();
    }

    @Post()
    async create(@Body() createCommentDto: CreateCommentDto, @AuthUser() user: UserEntity) {
        const post = await PostEntity.findOneBy({ id: createCommentDto.post });
        if (isNil(post)) {
            return this.failedResponse();
        }
        const parent = createCommentDto.parent
            ? await CommentEntity.findOneBy({ id: createCommentDto.parent })
            : null;
        return this.successResponse(
            await this.commentService.create(user, post, createCommentDto.content, parent),
        );
    }

    @Get()
    async findAll(@Query() queryDto: QueryPostCommentDto, @AuthUser() user: UserEntity) {
        const post = await PostEntity.findOneBy({ id: queryDto.post });
        if (isNil(post)) {
            return this.failedResponse();
        }
        return this.successResponse(
            await this.commentService.getPostComments(post, queryDto.page, queryDto.limit),
        );
    }

    @Get('children')
    async getChildren(@Query() queryDto: QueryChildrenCommentDto, @AuthUser() user: UserEntity) {
        const parent = await CommentEntity.findOneBy({ id: queryDto.parent });
        if (isNil(parent)) {
            return this.failedResponse();
        }
        return this.successResponse(
            await this.commentService.getChildrenComments(parent, queryDto.page, queryDto.limit),
        );
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
        return this.commentService.update(+id, updateCommentDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number, @AuthUser() user: UserEntity) {
        const comment = await CommentEntity.findOne({ where: { id }, relations: ['user', 'post'] });
        if (isNil(comment) || comment.user.id !== user.id) {
            return this.failedResponse();
        }
        return this.successResponse(await this.commentService.remove(comment));
    }
}
