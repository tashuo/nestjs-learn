import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { isNil } from 'lodash';
import { FeedService } from 'src/modules/feed/feed.service';
import { PostDeletedEvent } from 'src/modules/post/events/postDeleted.event';
import { PostPublishedEvent } from 'src/modules/post/events/postPublished.event';
import { FollowEvent } from 'src/modules/user/events/follow.event';
import { UnfollowEvent } from 'src/modules/user/events/unfollow.event';

@Processor({ name: 'feeds' })
export class FeedConsumer {
    constructor(private readonly feedService: FeedService) {}

    @Process()
    async handle(job: Job<any>) {
        console.log(`消费：${job.id}, ${job.data.jobType}`);
        if (isNil(job.data.jobType)) {
            return;
        }
        switch (job.data.jobType) {
            case PostPublishedEvent.name:
                await this.feedService.postPublish(job.data.postId);
                break;
            case PostDeletedEvent.name:
                await this.feedService.postDelete(job.data.postId);
                break;
            case FollowEvent.name:
                await this.feedService.userFollow(job.data.userId, job.data.targetUserId);
                break;
            case UnfollowEvent.name:
                await this.feedService.userUnfollow(job.data.userId, job.data.targetUserId);
                break;
            default:
                break;
        }
    }
}
