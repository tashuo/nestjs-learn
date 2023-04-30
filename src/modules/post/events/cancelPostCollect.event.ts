export class CancelPostCollectEvent {
    postId: number;

    collectId: number;

    public constructor(init?: Partial<CancelPostCollectEvent>) {
        Object.assign(this, init);
    }
}
