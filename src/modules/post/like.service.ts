import { Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { In } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { PostEntity } from './entities/post.entity';
import { PostLikeEntity } from './entities/like.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostLikeEvent } from './events/postLike.event';
import { CancelPostLikeEvent } from './events/cancelPostLike.event';

/**
 * 点赞
 */
@Injectable()
export class LikeService {
    constructor(protected readonly eventEmitter: EventEmitter2) {}
    /**
     * 点赞
     * @param user 用户
     * @param postId 帖子ID
     */
    async like(user: UserEntity, postId: number): Promise<boolean> {
        const post = await PostEntity.findOneBy({ id: postId });
        if (isNil(post)) {
            return false;
        }
        const result = await PostLikeEntity.createQueryBuilder()
            .insert()
            .orIgnore()
            .updateEntity(false)
            .values({
                user,
                post,
            })
            .execute();
        if (result.raw.affectedRows === 1) {
            this.eventEmitter.emit(
                'post.like',
                new PostLikeEvent({
                    userId: user.id,
                    postId,
                }),
            );
        }
        return result.raw.affectedRows === 1;
    }

    /**
     * 取消点赞
     * @param userId 用户ID
     * @param postId 帖子ID
     */
    async cancelLike(userId: number, postId: number) {
        const result = await PostLikeEntity.createQueryBuilder(PostLikeEntity.name)
            .where('userId = :userId AND postId = :postId', { userId, postId })
            .delete()
            .execute();
        if (result.affected === 1) {
            this.eventEmitter.emit(
                'post.cancelLike',
                new CancelPostLikeEvent({
                    userId,
                    postId,
                }),
            );
        }

        return result.affected === 1;
    }

    /**
     * 获取帖子点赞的用户列表
     * @param postId 帖子ID
     * @param page 页码
     * @param limit 数量
     */
    async getLikeUsers(postId: number, page = 1, limit = 10) {
        const postLikes = await PostLikeEntity.createQueryBuilder(PostLikeEntity.name)
            .where('postId = :postId', { postId })
            .select(['userId'])
            .orderBy('id', 'DESC')
            .offset((page - 1) * limit)
            .take(limit)
            .execute();
        if (isNil(postLikes)) {
            return [];
        }
        const userIds = postLikes.map((item: any) => {
            return item.userId;
        });
        return UserEntity.find({
            where: { id: In(userIds) },
            select: ['id', 'nickname', 'avatar'],
        });
    }

    /**
     * 获取用户的点赞帖子列表
     * @param userId 用户ID
     * @param page 页码
     * @param limit 数量
     */
    async getLikePosts(userId: number, page = 1, limit = 10) {
        const postLikes = await PostLikeEntity.createQueryBuilder(PostLikeEntity.name)
            .where('userId = :userId', { userId })
            .select(['postId'])
            .orderBy('id', 'DESC')
            .offset((page - 1) * limit)
            .take(limit)
            .execute();
        if (isNil(postLikes)) {
            return [];
        }
        const postIds = postLikes.map((item: any) => {
            return item.postId;
        });
        return PostEntity.find({
            where: { id: In(postIds) },
        });
    }
}
