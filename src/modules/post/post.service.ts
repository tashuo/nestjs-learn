import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { Tag } from '../tag/entities/tag.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostService {
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
        return await PostEntity.findOne({ where: { id: post.id }, relations: ['user', 'tags'] });
    }

    async findAll() {
        return await PostEntity.find({ relations: ['user', 'tags'], order: { id: 'DESC' } });
    }

    async findOne(id: number) {
        return await PostEntity.findOne({
            where: { id: id },
            relations: ['user', 'tags', 'postToCategories', 'categories'],
        });
    }

    async update(id: number, updatePostDto: UpdatePostDto) {
        const post = await PostEntity.findOneBy({ id: id });
        post.title = updatePostDto.title;
        post.content = updatePostDto.content;
        post.content_type = updatePostDto.content_type;
        await post.save();
    }

    async remove(id: number) {
        await PostEntity.delete({ id: id });
    }
}
