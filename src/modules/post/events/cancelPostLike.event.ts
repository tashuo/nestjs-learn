export class CancelPostLikeEvent {
    postId: number;

    userId: number;

    public constructor(init?: Partial<CancelPostLikeEvent>) {
        Object.assign(this, init);
    }
}
