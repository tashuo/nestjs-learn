export class PostLikeEvent {
    postId: number;

    userId: number;

    public constructor(init?: Partial<PostLikeEvent>) {
        Object.assign(this, init);
    }
}
