export class CommentLikeEvent {
    postId: number;

    commentId: number;

    userId: number;

    targetUserId: number;

    public constructor(init?: Partial<CommentLikeEvent>) {
        Object.assign(this, init);
    }
}
