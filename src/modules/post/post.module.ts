import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { LikeService } from './like.service';
import { PostListener } from './post.listener';

@Module({
    imports: [TypeOrmModule.forFeature([PostEntity])],
    controllers: [PostController],
    providers: [PostService, LikeService, PostListener],
})
export class PostModule {}
