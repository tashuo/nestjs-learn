import { Injectable } from '@nestjs/common';

import { isNil } from 'lodash';
import { FollowService } from '../user/follow.service';
import { FeedEntity } from './entities/feed.entity';
import { PostEntity } from '../post/entities/post.entity';

/**
 * feed流
 */
@Injectable()
export class FeedService {
    constructor(private readonly followService: FollowService) {}

    /**
     * 关注feeds流
     * @param userId 用户ID
     * @param page 页码
     * @param limit 数量
     */
    async getTimelineFeeds(userId: number, page = 1, limit = 10) {
        const feeds = await FeedEntity.createQueryBuilder()
            .where('user_id = :userId', { userId })
            .select(['post_id'])
            .orderBy('publish_time', 'DESC')
            .offset((page - 1) * limit)
            .take(limit)
            .execute();
        const postIds = feeds.map((item: any) => {
            return item.post_id;
        });
        return PostEntity.createQueryBuilder().where(`post.id IN(${postIds})`).getMany();
    }

    /**
     * 用户关注后同步被关注者动态(限制最近100条)
     * @param userId 用户ID
     * @param targetUserId 被关注用户ID
     */
    async userFollow(userId: number, targetUserId: number, limit = 100) {
        const recentQuery = PostEntity.createQueryBuilder(PostEntity.name)
            .where('userId = :targetUserId', { targetUserId })
            .select(['id', 'created_at'])
            .orderBy('id', 'DESC')
            .take(limit);
        const recent100Posts = await PostEntity.query(...recentQuery.getQueryAndParameters());
        if (isNil(recent100Posts)) {
            return;
        }

        const insertData = recent100Posts.map((item: PostEntity) => {
            return {
                post_id: item.id,
                user_id: userId,
                author_id: targetUserId,
                publish_time: item.created_at.getTime() / 1000,
            };
        });
        FeedEntity.createQueryBuilder(FeedEntity.name)
            .insert()
            .orIgnore()
            .values(insertData)
            .execute();
    }

    /**
     * 取消关注清除被关注者所有动态
     * @param userId 用户ID
     * @param targetUserId 被关注者ID
     */
    async userUnfollow(userId: number, targetUserId: number) {
        FeedEntity.createQueryBuilder(FeedEntity.name)
            .where('user_id = :userId', { userId })
            .where('author_id = :targetUserId', { targetUserId })
            .delete()
            .execute();
    }

    // 被关注者发帖分发动态
    async postPublish(postId: number) {
        console.log(`publish ${postId}`);
        const post = await PostEntity.findOne({ where: { id: postId }, relations: ['user'] });
        if (isNil(post)) {
            return;
        }
        const insertData = [];
        for (let i = 1; ; i++) {
            const followers = await this.followService.getFollowers(post.user, i, 500);
            if (isNil(followers)) {
                break;
            }
            insertData.push(
                followers.map((userId) => {
                    return {
                        post_id: post.id,
                        user_id: userId,
                        author_id: post.user.id,
                        publish_time: post.created_at.getTime() / 1000,
                    };
                }),
            );
            FeedEntity.createQueryBuilder(FeedEntity.name)
                .insert()
                .orIgnore()
                .values(insertData as any)
                .execute();
        }
    }

    // 被关注者发帖删除动态
    async postDelete(postId: string) {
        console.log(`delete ${postId}`);
        FeedEntity.createQueryBuilder(FeedEntity.name)
            .where('post_id = :postId', { postId })
            .delete()
            .execute();
    }
}
