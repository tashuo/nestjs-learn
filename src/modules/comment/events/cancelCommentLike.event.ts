export class CancelCommentLikeEvent {
    commentId: number;

    userId: number;

    public constructor(init?: Partial<CancelCommentLikeEvent>) {
        Object.assign(this, init);
    }
}
