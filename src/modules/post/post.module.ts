import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { BullModule } from '@nestjs/bull';
import { PostRepository } from './post.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post]),
        BullModule.registerQueue({
            name: 'default',
        }),
    ],
    controllers: [PostController],
    providers: [PostService, PostRepository],
})
export class PostModule {}
