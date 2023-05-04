import { OnEvent } from '@nestjs/event-emitter';
import { PostPublishedEvent } from './events/postPublished.event';
import { PostLikeEvent } from './events/postLike.event';
import { PostEntity } from './entities/post.entity';
import { CancelPostLikeEvent } from './events/cancelPostLike.event';
import { PostCollectEvent } from './events/postCollect.event';
import { CancelPostCollectEvent } from './events/cancelPostCollect.event';
import { CommentCreateEvent } from '../comment/events/create.event';
import { CommentDeleteEvent } from '../comment/events/delete.event';

export class PostListener {
    @OnEvent('post.created')
    handlePostPublishedEvent(payload: PostPublishedEvent) {
        console.log(`post ${payload.postId} created`);
    }

    @OnEvent('post.like')
    async handlePostLikeEvent(payload: PostLikeEvent) {
        console.log(`post ${payload.postId} like`);
        await PostEntity.createQueryBuilder(PostEntity.name)
            .where('id = :id', { id: payload.postId })
            .update(PostEntity)
            .set({
                like_count: () => 'like_count + 1',
            })
            .execute();
    }

    @OnEvent('post.cancelLike')
    async handlePostCancelLikeEvent(payload: CancelPostLikeEvent) {
        console.log(`post ${payload.postId} cancelLike`);
        await PostEntity.createQueryBuilder(PostEntity.name)
            .where('id = :id', { id: payload.postId })
            .andWhere('like_count > :count', { count: 0 })
            .update(PostEntity)
            .set({
                like_count: () => 'like_count - 1',
            })
            .execute();
    }

    @OnEvent('comment.create')
    async handleCommentCreateEvent(payload: CommentCreateEvent) {
        await PostEntity.createQueryBuilder(PostEntity.name)
            .where('id = :id', { id: payload.postId })
            .update(PostEntity)
            .set({
                comment_count: () => 'comment_count + 1',
            })
            .execute();
    }

    @OnEvent('comment.delete')
    async handleCommentDeleteEvent(payload: CommentDeleteEvent) {
        console.log(`comment delete, ${payload.commentId}-${payload.postId}`);
        await PostEntity.createQueryBuilder(PostEntity.name)
            .where('id = :id', { id: payload.postId })
            .andWhere('comment_count > :count', { count: 0 })
            .update(PostEntity)
            .set({
                comment_count: () => 'comment_count - 1',
            })
            .execute();
    }

    @OnEvent('post.collect')
    async handlePostCollectEvent(payload: PostCollectEvent) {
        console.log(`post ${payload.postId} collect`);
        await PostEntity.createQueryBuilder(PostEntity.name)
            .where('id = :id', { id: payload.postId })
            .update(PostEntity)
            .set({
                collect_count: () => 'collect_count + 1',
            })
            .execute();
    }

    @OnEvent('post.cancelCollect')
    async handlePostCancelCollectEvent(payload: CancelPostCollectEvent) {
        console.log(`post ${payload.postId} cancelCollect`);
        await PostEntity.createQueryBuilder(PostEntity.name)
            .where('id = :id', { id: payload.postId })
            .andWhere('collect_count > :count', { count: 0 })
            .update(PostEntity)
            .set({
                collect_count: () => 'collect_count - 1',
            })
            .execute();
    }
}
