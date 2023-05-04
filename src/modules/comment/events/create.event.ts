export class CommentCreateEvent {
    postId: number;

    commentId: number;

    public constructor(init?: Partial<CommentCreateEvent>) {
        Object.assign(this, init);
    }
}
