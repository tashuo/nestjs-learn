import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { Tag } from '../tag/entities/tag.entity';
import { User } from '../user/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
    constructor(private readonly postRepository: PostRepository) {}

    async create({ tags, ...data }: CreatePostDto, user: User) {
        let postTags = [];
        if (tags) {
            postTags = await Tag.find({ where: { id: In(tags) } });
        }
        const post = await Post.save({
            ...data,
            user: user,
            tags: postTags,
        } as any);
        return await Post.findOne({ where: { id: post.id }, relations: ['user', 'tags'] });
    }

    async findAll() {
        return await Post.find({ relations: ['user', 'tags'], order: { id: 'DESC' } });
    }

    async findOne(id: number) {
        return await Post.findOne({ where: { id: id }, relations: ['user', 'tags'] });
    }

    async update(id: number, updatePostDto: UpdatePostDto) {
        const post = await Post.findOneBy({ id: id });
        post.title = updatePostDto.title;
        post.content = updatePostDto.content;
        post.content_type = updatePostDto.content_type;
        await post.save();
    }

    async remove(id: number) {
        await Post.delete({ id: id });
    }
}
