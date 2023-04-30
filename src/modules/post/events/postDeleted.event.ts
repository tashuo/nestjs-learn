export class PostDeletedEvent {
    postId: number;

    userId: number;

    public constructor(init?: Partial<PostDeletedEvent>) {
        Object.assign(this, init);
    }
}
