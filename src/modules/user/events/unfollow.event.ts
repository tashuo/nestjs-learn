export class UnfollowEvent {
    userId: number;

    targetUserId: number; // 被关注者uid

    public constructor(init?: Partial<UnfollowEvent>) {
        Object.assign(this, init);
    }
}
