export class PostPublishedEvent {
    postId: number;

    userId: number;

    publishTime: number;

    public constructor(init?: Partial<PostPublishedEvent>) {
        Object.assign(this, init);
    }
}
