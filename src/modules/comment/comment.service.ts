import { Injectable } from '@nestjs/common';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UserEntity } from '../user/entities/user.entity';
import { CommentEntity } from './entities/comment.entity';
import { PostEntity } from '../post/entities/post.entity';
import { CommentRepository } from './comment.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommentCreateEvent } from './events/create.event';
import { CommentDeleteEvent } from './events/delete.event';

@Injectable()
export class CommentService {
    constructor(
        private readonly repository: CommentRepository,
        protected readonly eventEmitter: EventEmitter2,
    ) {}

    async create(user: UserEntity, post: PostEntity, content: string, parent?: CommentEntity) {
        const comment = await CommentEntity.save({
            post,
            content,
            user,
            parent: parent,
        });

        this.eventEmitter.emit(
            'comment.create',
            new CommentCreateEvent({
                commentId: comment.id,
                postId: post.id,
            }),
        );

        return comment;
    }

    async getPostComments(post: PostEntity, page = 1, limit = 10) {
        const comments = await CommentEntity.createQueryBuilder('comment')
            .withDeleted()
            .leftJoinAndSelect(`comment.children`, 'children')
            .leftJoinAndSelect('comment.user', 'commentUser')
            .leftJoinAndSelect('children.user', 'childrenUser')
            .select([
                'comment.id',
                'comment.content',
                'comment.user',
                'comment.created_at',
                'children.id',
                'children.content',
                'children.user',
                'children.created_at',
                'commentUser.id',
                'commentUser.nickname',
                'commentUser.avatar',
                'childrenUser.id',
                'childrenUser.nickname',
                'childrenUser.avatar',
            ])
            .where(`comment.postId = :postId`, { postId: post.id })
            .andWhere('comment.parentId IS NULL')
            .orderBy('comment.id', 'DESC')
            .offset((page - 1) * limit)
            .limit(limit)
            .getMany();

        return comments;
    }

    async getChildrenComments(parent: CommentEntity, page = 1, limit = 10) {
        // return await this.repository.findDescendantsTree(parent, { relations: ['user'], depth: 2 });
        const qb = this.repository
            .createDescendantsQueryBuilder('comment', 'commentClosure', parent)
            .withDeleted()
            .leftJoinAndSelect('comment.user', 'user')
            .leftJoinAndSelect('comment.parent', 'parent')
            .leftJoinAndSelect('parent.user', 'parentUser')
            .select([
                'comment.id',
                'comment.content',
                'comment.created_at',
                'comment.deleted_at',
                'parent.id',
                'parent.content',
                'parent.created_at',
                'parent.deleted_at',
                'user.id',
                'user.nickname',
                'user.avatar',
                'parentUser.id',
                'parentUser.nickname',
                'parentUser.avatar',
            ])
            .orderBy('comment.id', 'DESC')
            .offset((page - 1) * limit)
            .limit(limit);
        const children = await qb.getManyAndCount();
        const entities = children[0];
        const total = children[1];
        return entities;
    }

    update(id: number, updateCommentDto: UpdateCommentDto) {
        return `This action updates a #${id} comment`;
    }

    async remove(comment: CommentEntity) {
        const result = await CommentEntity.createQueryBuilder()
            .softDelete()
            .where('id = :id', { id: comment.id })
            .execute();

        if (result.affected === 1) {
            this.eventEmitter.emit(
                'comment.delete',
                new CommentDeleteEvent({
                    commentId: comment.id,
                    postId: comment.post.id,
                }),
            );
        }
    }
}
