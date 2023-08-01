export class ConnectedEvent {
    userId: number;

    public constructor(init: ConnectedEvent) {
        Object.assign(this, init);
    }
}
