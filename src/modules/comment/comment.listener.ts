import { OnEvent } from '@nestjs/event-emitter';
import { CommentLikeEvent } from './events/commentLike.event';
import { CommentEntity } from './entities/comment.entity';
import { CancelCommentLikeEvent } from './events/cancelCommentLike.event';
import { CommentCreateEvent } from './events/create.event';
import { CommentDeleteEvent } from './events/delete.event';

export class CommentListener {
    @OnEvent('comment.create')
    async handleCommentCreateEvent(payload: CommentCreateEvent) {
        console.log(`comment ${payload.commentId} created`);
        payload.rootCommentId &&
            CommentEntity.createQueryBuilder(CommentEntity.name)
                .where('id = :id', { id: payload.rootCommentId })
                .update({
                    reply_count: () => 'reply_count + 1',
                })
                .execute();
    }

    @OnEvent('comment.delete')
    async handleCommentDeleteEvent(payload: CommentDeleteEvent) {
        console.log(`comment ${payload.commentId} deleted`);
        payload.rootCommentId &&
            CommentEntity.createQueryBuilder(CommentEntity.name)
                .where('id = :id', { id: payload.rootCommentId })
                .andWhere('reply_count > :reply_count', { reply_count: 0 })
                .update({
                    reply_count: () => 'reply_count - 1',
                })
                .execute();
    }

    @OnEvent('comment.like')
    async handleCommentLikeEvent(payload: CommentLikeEvent) {
        console.log(`comment ${payload.commentId} like`);
        await CommentEntity.createQueryBuilder(CommentEntity.name)
            .where('id = :id', { id: payload.commentId })
            .update(CommentEntity)
            .set({
                like_count: () => 'like_count + 1',
            })
            .execute();
    }

    @OnEvent('comment.cancelLike')
    async handleCommentCancelLikeEvent(payload: CancelCommentLikeEvent) {
        console.log(`comment ${payload.commentId} cancelLike`);
        await CommentEntity.createQueryBuilder(CommentEntity.name)
            .where('id = :id', { id: payload.commentId })
            .andWhere('like_count > :count', { count: 0 })
            .update(CommentEntity)
            .set({
                like_count: () => 'like_count - 1',
            })
            .execute();
    }
}
