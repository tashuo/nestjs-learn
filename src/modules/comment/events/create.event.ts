export class CommentCreateEvent {
    postId: number;

    commentId: number;

    rootCommentId: number;

    public constructor(init?: Partial<CommentCreateEvent>) {
        Object.assign(this, init);
    }
}
