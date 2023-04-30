export class PostCollectEvent {
    postId: number;

    collectId: number;

    public constructor(init?: Partial<PostCollectEvent>) {
        Object.assign(this, init);
    }
}
