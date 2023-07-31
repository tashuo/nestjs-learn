import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentEntity } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentRepository } from './comment.repository';
import { LikeService } from '../post/like.service';
import { CommentListener } from './comment.listener';

@Module({
    imports: [TypeOrmModule.forFeature([CommentEntity])],
    controllers: [CommentController],
    providers: [CommentService, CommentRepository, LikeService, CommentListener],
})
export class CommentModule {}
