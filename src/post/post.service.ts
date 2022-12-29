import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
    async create(createPostDto: CreatePostDto, user_id: number) {
        const post = new Post();
        post.title = createPostDto.title;
        post.content = createPostDto.content;
        post.content_type = createPostDto.content_type;
        post.user_id = user_id;
        await post.save();
    }

    findAll() {
        return Post.find();
    }

    findOne(id: number) {
        return Post.findBy({ id: id });
    }

    async update(id: number, updatePostDto: UpdatePostDto) {
        const post = await Post.findOneBy({ id: id });
        post.title = updatePostDto.title;
        post.content = updatePostDto.content;
        post.content_type = updatePostDto.content_type;
        await post.save();
    }

    remove(id: number) {
        Post.delete({ id: id });
    }
}
