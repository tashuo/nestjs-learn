import { Injectable } from '@nestjs/common';
import { BaseEntity, In, ObjectLiteral } from 'typeorm';
import { Tag } from '../tag/entities/tag.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity, PostInfo } from './entities/post.entity';
import { CollectEntity, CollectPostEntity } from '../collect/entities/collect.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostPublishedEvent } from './events/postPublished.event';
import { PostCollectEvent } from './events/postCollect.event';
import { CancelPostCollectEvent } from './events/cancelPostCollect.event';
import { LikeService } from './like.service';
import { PostLikeEntity } from './entities/like.entity';
import { convertToPaginationResponse } from 'src/utils/helper';

@Injectable()
export class PostService {
    constructor(
        protected readonly eventEmitter: EventEmitter2,
        protected readonly likeService: LikeService,
    ) {}

    async create({ tags, images, ...data }: CreatePostDto, user: UserEntity) {
        let postTags = [];
        if (tags) {
            postTags = await Tag.find({ where: { id: In(tags) } });
        }
        const image_paths = images ? images.join(',') : '';
        const post = await PostEntity.save({
            ...data,
            image_paths,
            user: user,
            tags: postTags,
        } as any);

        this.eventEmitter.emit(
            'post.publish',
            new PostPublishedEvent({
                userId: user.id,
                postId: post.id,
                publishTime: Date.now(),
            }),
        );

        return await PostEntity.findOne({ where: { id: post.id }, relations: ['user', 'tags'] });
    }

    async findAll(loginUserId?: number, page = 1, limit = 10, anchorUserId: number | null = null) {
        const query = PostEntity.createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoinAndSelect('post.tags', 'tags')
            .orderBy('post.id', 'DESC')
            .offset((page - 1) * limit)
            .limit(limit);
        if (anchorUserId) {
            query.where('post.userId = :anchorUserId', { anchorUserId });
        }
        const data = await query.getManyAndCount();

        return convertToPaginationResponse(
            { page, limit },
            await this.renderPostInfo(data[0], loginUserId),
            data[1],
        );
    }

    async getLikePosts(userId: number, loginUserId?: number, page = 1, limit = 10) {
        const query = PostLikeEntity.createQueryBuilder('like_post')
            .innerJoinAndSelect('like_post.post', 'post')
            .innerJoinAndSelect('post.user', 'user')
            .where('like_post.userId = :userId', { userId })
            .orderBy('like_post.id', 'DESC')
            .offset((page - 1) * limit)
            .limit(limit);
        const data = await query.getManyAndCount();

        return convertToPaginationResponse(
            { page, limit },
            await this.renderPostInfoV2(data[0], loginUserId),
            data[1],
        );
    }

    async getCollectPosts(
        userId: number,
        collectId?: number,
        loginUserId?: number,
        page = 1,
        limit = 10,
    ) {
        const query = CollectPostEntity.createQueryBuilder('collect_post')
            .leftJoinAndSelect('collect_post.collect', 'collect')
            .leftJoinAndSelect('collect_post.post', 'post')
            .leftJoinAndSelect('post.user', 'user')
            .where('collect.userId = :userId', { userId })
            .orderBy('collect_post.id', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        if (collectId) {
            query.andWhere('collect.id = :collectId', { collectId });
        }
        const data = await query.getManyAndCount();

        return convertToPaginationResponse(
            { page, limit },
            await this.renderPostInfoV2<CollectPostEntity>(data[0], loginUserId),
            data[1],
        );
    }

    async findOne(id: number) {
        return await PostEntity.findOne({
            where: { id: id },
            relations: ['user', 'tags', 'postToCategories', 'categories'],
        });
    }

    async update(post: PostEntity, updatePostDto: UpdatePostDto) {
        post.title = updatePostDto.title;
        post.content = updatePostDto.content;
        await post.save();
    }

    async remove(id: number) {
        await PostEntity.delete({ id: id });
    }

    async collect(post: PostEntity, collect: CollectEntity, remark = '') {
        const result = await CollectPostEntity.createQueryBuilder()
            .insert()
            .orIgnore()
            .updateEntity(false)
            .values({
                collect,
                post,
                remark,
            })
            .execute();
        if (result.raw.affectedRows === 1) {
            this.eventEmitter.emit(
                'post.collect',
                new PostCollectEvent({
                    postId: post.id,
                    collectId: collect.id,
                    userId: collect.user.id,
                    targetUserId: post.user.id,
                }),
            );
        }
    }

    async cancleCollect(post: PostEntity, collect: CollectEntity) {
        const result = await CollectPostEntity.createQueryBuilder()
            .delete()
            .where({
                collect,
                post,
            })
            .execute();
        if (result.affected === 1) {
            this.eventEmitter.emit(
                'post.cancelCollect',
                new CancelPostCollectEvent({
                    postId: post.id,
                    collectId: collect.id,
                }),
            );
        }
    }

    async renderPostInfo(posts: PostEntity[], userId?: number): Promise<PostInfo[]> {
        const userLikedPostIds = userId
            ? await this.likeService.filterLikePostIds(
                  userId,
                  posts.map((v: PostEntity) => v.id),
              )
            : [];
        return posts.map(
            (v: PostEntity) => new PostInfo({ ...v, isLiked: userLikedPostIds.includes(v.id) }),
        );
    }

    async renderPostInfoV2<T extends ObjectLiteral & { post: PostEntity }>(
        posts: T[],
        userId?: number,
    ): Promise<T[]> {
        if (posts.length === 0) {
            return posts;
        }
        const userLikedPostIds = userId
            ? await this.likeService.filterLikePostIds(
                  userId,
                  posts.map((v: T) => v.post.id),
              )
            : [];
        return posts.map((v: T) => {
            v.post = new PostInfo({ ...v.post, isLiked: userLikedPostIds.includes(v.post.id) });
            return v;
        });
    }
}
