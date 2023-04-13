import { Injectable } from '@nestjs/common';
import { SocketWithUserData, UserSocket } from './types';
import { Server } from 'socket.io';

@Injectable()
export class WsService {
    // userId => socket id
    private userSocket: UserSocket;

    private server: Server;

    constructor() {
        this.userSocket = new Map();
    }

    setServer(server: Server) {
        this.server = server;
    }

    initUserSocket() {
        this.userSocket = new Map();
    }

    getUserSocketId(userId: number) {
        return this.userSocket.get(userId);
    }

    addUserSocket(userId: number, client: SocketWithUserData) {
        this.userSocket.set(userId, client.id);
    }

    removeUserSocket(userId: number) {
        this.userSocket.delete(userId);
    }

    async pushMessageToUser(toUserId: number, event: string, data: any) {
        if (!this.userSocket.has(toUserId)) {
            console.log(`${toUserId}不在线`);
            return;
        }
        this.server.to(this.getUserSocketId(toUserId)).emit(event, data);
    }
}
