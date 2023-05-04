export class CommentDeleteEvent {
    postId: number;

    commentId: number;

    public constructor(init?: Partial<CommentDeleteEvent>) {
        Object.assign(this, init);
    }
}
