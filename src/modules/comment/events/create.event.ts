export class CommentCreateEvent {
    postId: number;

    commentId: number;

    rootCommentId: number;

    userId: number;

    targetUserId: number;

    public constructor(init?: Partial<CommentCreateEvent>) {
        Object.assign(this, init);
    }
}
