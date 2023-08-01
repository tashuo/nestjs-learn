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
        console.log('set server');
        this.server = server;
    }

    getUserSocketId(userId: number) {
        return this.userSocket.get(userId);
    }

    addUserSocket(userId: number, client: SocketWithUserData) {
        this.userSocket.set(userId, client.id);
        console.log(
            `add socket ${userId} - ${client.id} - ${this.userSocket.size} - ${this.getUserSocketId(
                userId,
            )} - ${this.userSocket.has(userId)}`,
        );
    }

    removeUserSocket(userId: number) {
        console.log(`remove socket ${userId}`);
        this.userSocket.delete(userId);
    }

    async pushMessageToUser(toUserId: number, event: string, data: any) {
        console.log(this.userSocket.size);
        if (!this.userSocket.has(toUserId)) {
            console.log(`${toUserId}不在线`);
            return;
        }
        this.server.to(this.getUserSocketId(toUserId)).emit(event, data);
    }
}
