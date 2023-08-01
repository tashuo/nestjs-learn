import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { NoticeEntity } from './entities/notice.entity';
import { NoticeTypes } from './types';
import { FollowEvent } from '../user/events/follow.event';
import { PostLikeEvent } from '../post/events/postLike.event';
import { PostCollectEvent } from '../post/events/postCollect.event';
import { CommentCreateEvent } from '../comment/events/create.event';
import { UserEntity } from '../user/entities/user.entity';
import { PostEntity } from '../post/entities/post.entity';
import { CommentEntity } from '../comment/entities/comment.entity';
import { CommentLikeEvent } from '../comment/events/commentLike.event';
import { WsService } from '../ws/ws.service';
import { ConnectedEvent } from '../ws/events/connected.event';
import { NoticeService } from './notice.service';

// todo 异步化
@Injectable()
export class NoticeListener {
    constructor(
        private readonly wsService: WsService,
        private readonly noticeService: NoticeService,
    ) {}

    @OnEvent('user.follow')
    async handleFollow(payload: FollowEvent) {
        console.log('follow');
        NoticeEntity.save({
            operator: await UserEntity.findOneBy({ id: payload.userId }),
            user: await UserEntity.findOneBy({ id: payload.targetUserId }),
            type: NoticeTypes.FOLLOW,
        });
        this.wsService.pushMessageToUser(payload.targetUserId, 'newNotification', true);
    }

    @OnEvent('post.like')
    async handleLike(payload: PostLikeEvent) {
        console.log('like');
        NoticeEntity.save({
            operator: await UserEntity.findOneBy({ id: payload.userId }),
            user: await UserEntity.findOneBy({ id: payload.targetUserId }),
            type: NoticeTypes.LIKE,
            post: await PostEntity.findOneBy({ id: payload.postId }),
        });
        this.wsService.pushMessageToUser(payload.targetUserId, 'newNotification', true);
    }

    @OnEvent('post.collect')
    async handleCollect(payload: PostCollectEvent) {
        console.log('collect');
        NoticeEntity.save({
            user: await UserEntity.findOneBy({ id: payload.targetUserId }),
            operator: await UserEntity.findOneBy({ id: payload.userId }),
            type: NoticeTypes.COLLECT,
            post: await PostEntity.findOneBy({ id: payload.postId }),
        });
    }

    @OnEvent('comment.create')
    async handleComment(payload: CommentCreateEvent) {
        console.log('comment');
        NoticeEntity.save({
            user: await UserEntity.findOneBy({ id: payload.targetUserId }),
            operator: await UserEntity.findOneBy({ id: payload.userId }),
            type: NoticeTypes.COMMENT,
            comment: await CommentEntity.findOneBy({ id: payload.commentId }),
            post: await PostEntity.findOneBy({ id: payload.postId }),
        });
        this.wsService.pushMessageToUser(payload.targetUserId, 'newNotification', true);
    }

    @OnEvent('comment.like')
    async handleCommentLike(payload: CommentLikeEvent) {
        console.log('comment');
        const comment = await CommentEntity.findOne({
            where: { id: payload.commentId },
            relations: ['user', 'post'],
        });
        NoticeEntity.save({
            user: await UserEntity.findOneBy({ id: payload.targetUserId }),
            operator: comment.user,
            type: NoticeTypes.LIKE,
            comment: comment,
            post: comment.post,
        });
        this.wsService.pushMessageToUser(payload.targetUserId, 'newNotification', true);
    }

    @OnEvent('ws.connected')
    async handleUserConnectedWs(payload: ConnectedEvent) {
        const unreadNoticeCount = await this.noticeService.getUnreadNoticeCount(payload.userId);
        this.wsService.pushMessageToUser(payload.userId, 'notification', unreadNoticeCount);
    }
}
