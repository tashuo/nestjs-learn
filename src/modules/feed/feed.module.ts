import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedEntity } from './entities/feed.entity';
import { FeedService } from './feed.service';
import { FollowService } from '../user/follow.service';
import { FeedController } from './feed.controller';
import { FeedListener } from './feed.listener';

@Module({
    imports: [TypeOrmModule.forFeature([FeedEntity])],
    controllers: [FeedController],
    providers: [FeedService, FollowService, FeedListener],
    exports: [FeedService],
})
export class FeedModule {}
