export class FollowEvent {
    userId: number;

    targetUserId: number; // 被关注者uid

    public constructor(init?: Partial<FollowEvent>) {
        Object.assign(this, init);
    }
}
