export class CommentLikeEvent {
    commentId: number;

    userId: number;

    public constructor(init?: Partial<CommentLikeEvent>) {
        Object.assign(this, init);
    }
}
