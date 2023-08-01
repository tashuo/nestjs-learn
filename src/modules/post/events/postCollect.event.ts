export class PostCollectEvent {
    postId: number;

    collectId: number;

    userId: number;

    targetUserId: number;

    public constructor(init?: Partial<PostCollectEvent>) {
        Object.assign(this, init);
    }
}
