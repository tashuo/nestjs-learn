import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { BullModule } from '@nestjs/bull';
import { PostRepository } from './post.repository';
import { WsService } from '../ws/ws.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([PostEntity]),
        BullModule.registerQueue({
            name: 'default',
        }),
    ],
    controllers: [PostController],
    providers: [PostService, PostRepository],
})
export class PostModule {}
