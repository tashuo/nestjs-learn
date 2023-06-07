import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { Tag } from '../tag/entities/tag.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { CollectEntity, CollectPostEntity } from '../collect/entities/collect.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostPublishedEvent } from './events/postPublished.event';
import { PostCollectEvent } from './events/postCollect.event';
import { CancelPostCollectEvent } from './events/cancelPostCollect.event';

@Injectable()
export class PostService {
    constructor(protected readonly eventEmitter: EventEmitter2) {}

    async create({ tags, ...data }: CreatePostDto, user: UserEntity) {
        let postTags = [];
        if (tags) {
            postTags = await Tag.find({ where: { id: In(tags) } });
        }
        const post = await PostEntity.save({
            ...data,
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

    async findAll(page = 1, limit = 10) {
        return await PostEntity.find({
            relations: ['user', 'tags'],
            order: { id: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
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
        post.content_type = updatePostDto.content_type;
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
}
