import { OnEvent } from '@nestjs/event-emitter';
import { PostPublishedEvent } from '../post/events/postPublished.event';
import { PostDeletedEvent } from '../post/events/postDeleted.event';
import { FollowEvent } from '../user/events/follow.event';
import { UnfollowEvent } from '../user/events/unfollow.event';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export class FeedListener {
    constructor(@InjectQueue('feeds') private feedQueue: Queue) {}

    @OnEvent('post.publish')
    handlePublishEvent(payload: PostPublishedEvent) {
        this.handle(payload);
    }

    @OnEvent('post.delete')
    handledeleteEvent(payload: PostDeletedEvent) {
        this.handle(payload);
    }

    @OnEvent('user.follow')
    handleFollowEvent(payload: FollowEvent) {
        this.handle(payload);
    }

    @OnEvent('user.unfollow')
    handleUnfollowEvent(payload: UnfollowEvent) {
        this.handle(payload);
    }

    private handle(event: any) {
        this.feedQueue.add({ ...event, jobType: event.constructor.name });
    }
}
