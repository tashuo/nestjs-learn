import { Injectable } from '@nestjs/common';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UserEntity } from '../user/entities/user.entity';
import { CommentEntity } from './entities/comment.entity';
import { PostEntity } from '../post/entities/post.entity';
import { CommentRepository } from './comment.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommentCreateEvent } from './events/create.event';
import { CommentDeleteEvent } from './events/delete.event';
import { convertToCursorPaginationResponse, convertToPaginationResponse } from 'src/utils/helper';
import { isNil, groupBy, keyBy } from 'lodash';
import { In, Repository } from 'typeorm';
import { LikeService } from '../post/like.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentService {
    constructor(
        private readonly repository: CommentRepository,
        protected readonly eventEmitter: EventEmitter2,
        private readonly likeService: LikeService,
        @InjectRepository(CommentEntity) repo: Repository<CommentEntity>,
    ) {
        // 设置mpath可见
        repo.metadata.columns = repo.metadata.columns.map((x) => {
            if (x.databaseName === 'mpath') {
                x.isVirtual = false;
            }
            return x;
        });
    }

    async create(user: UserEntity, post: PostEntity, content: string, parent?: CommentEntity) {
        const comment = await CommentEntity.save({
            post,
            content,
            user,
            parent: parent,
        });

        const rootCommentId = parent
            ? parseInt(parent.mpath.substring(0, parent.mpath.indexOf('.')))
            : 0;
        this.eventEmitter.emit(
            'comment.create',
            new CommentCreateEvent({
                commentId: comment.id,
                postId: post.id,
                rootCommentId,
            }),
        );

        return CommentEntity.findOne({
            where: { id: comment.id },
            relations: ['user', 'parent', 'parent.user'],
        });
    }

    async getPostComments(post: PostEntity, loginUserId: number | null, cursor = 0, limit = 10) {
        const query = CommentEntity.createQueryBuilder('comment')
            .withDeleted()
            .leftJoinAndSelect('comment.user', 'commentUser')
            .where(`comment.postId = :postId`, { postId: post.id })
            .andWhere('comment.parentId IS NULL')
            .orderBy('comment.id', 'DESC')
            .limit(limit);
        cursor > 0 && query.andWhere('comment.id < :cursor', { cursor });
        let data = await query.getMany();

        // 每个根节点获取固定数量的叶子结点(可根据日期或点赞数排序)
        const rootCommentIds = data.map((v: CommentEntity) => v.id);
        if (rootCommentIds.length > 0) {
            const sql = `SELECT id, p FROM (
                SELECT *, substring(mpath, 1, instr(mpath, '.')) as p, ROW_NUMBER() OVER (PARTITION BY substring(mpath, 1, instr(mpath, '.')) ORDER BY id DESC) AS n
                FROM comments
                where parentId is not null and (${rootCommentIds
                    .map((v: number) => ` mpath like '${v}.%' or `)
                    .join('')} false)
            ) AS x WHERE n <= 3`;
            const children = await CommentEntity.getRepository().manager.query(sql);
            const rootChildrenIds = groupBy(children, 'p');
            const childrenComments = keyBy(
                await CommentEntity.find({
                    where: {
                        id: In(children.map((v) => v.id)),
                    },
                    relations: ['user', 'parent', 'parent.user'],
                    order: {
                        id: 'DESC',
                    },
                }),
                'id',
            );
            data = data.map((v) => {
                const k = `${v.id}.`;
                v.children = [];
                if (!isNil(rootChildrenIds[k]) && rootChildrenIds[k].length !== 0) {
                    v.children = rootChildrenIds[k].map((v) => {
                        return childrenComments[v.id];
                    });
                }
                return v;
            });
        }

        return convertToCursorPaginationResponse(
            { cursor: rootCommentIds.at(-1) || 0, limit },
            await this.renderCommentInfo(data, loginUserId),
        );
    }

    async getChildrenComments(
        parent: CommentEntity,
        loginUserId: number | null,
        cursor = 0,
        limit = 10,
    ) {
        const qb = this.repository
            .createDescendantsQueryBuilder('comment', 'commentClosure', parent)
            .withDeleted()
            .leftJoinAndSelect('comment.user', 'user')
            .leftJoinAndSelect('comment.parent', 'parent')
            .leftJoinAndSelect('parent.user', 'parentUser')
            .andWhere('comment.parent is not null')
            .orderBy('comment.id', 'DESC')
            .limit(limit);
        cursor > 0 && qb.andWhere('comment.id < :cursor', { cursor });
        const data = await qb.getMany();
        return convertToCursorPaginationResponse(
            { cursor: data.map((v: CommentEntity) => v.id).at(-1) || 0, limit },
            await this.renderCommentInfo(data, loginUserId),
        );
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
            const rootCommentId = comment.mpath
                ? parseInt(comment.mpath.substring(0, comment.mpath.indexOf('.')))
                : 0;
            this.eventEmitter.emit(
                'comment.delete',
                new CommentDeleteEvent({
                    commentId: comment.id,
                    postId: comment.post.id,
                    rootCommentId,
                }),
            );
        }
    }

    async renderCommentInfo(
        comments: CommentEntity[],
        userId: number | null,
    ): Promise<CommentEntity[]> {
        const commentIds = [];
        if (userId) {
            comments.forEach((v: CommentEntity) => {
                commentIds.push(v.id);
                v.children?.forEach((v: CommentEntity) => commentIds.push(v.id));
            });
        }
        const userLikedCommentIds =
            commentIds.length > 0
                ? await this.likeService.filterLikeCommentIds(userId, commentIds)
                : [];
        return comments.map((v: CommentEntity) => {
            v.interaction_info = {
                liked: userLikedCommentIds.includes(v.id),
                like_count: v.like_count,
                reply_count: v.reply_count,
            };
            v.children = v.children?.map((v: CommentEntity) => {
                v.interaction_info = {
                    liked: userLikedCommentIds.includes(v.id),
                    like_count: v.like_count,
                    reply_count: v.reply_count,
                };
                return v;
            });
            return v;
        });
    }
}
