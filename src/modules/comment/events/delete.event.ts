export class CommentDeleteEvent {
    postId: number;

    commentId: number;

    rootCommentId: number;

    public constructor(init?: Partial<CommentDeleteEvent>) {
        Object.assign(this, init);
    }
}
