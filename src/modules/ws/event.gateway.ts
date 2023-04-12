import { Inject, Injectable } from '@nestjs/common';
import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

// import { Server } from 'ws';

import { Server } from 'socket.io';

import * as net from 'net';

import { getClientIp } from 'request-ip';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { JwtService } from '@nestjs/jwt';
import { ValidationError } from 'class-validator';

@Injectable()
@WebSocketGateway(3002, { cors: true, transports: ['websocket'] })
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    // constructor(
    //     @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    //     private readonly jwtService: JwtService,
    // ) {}

    @WebSocketServer()
    server: Server;

    async afterInit(wss: Server) {
        console.log('inited');
        // const httpServer: net.Server = wss._server;
        // httpServer.removeAllListeners('upgrade');
        // httpServer.on('upgrade', async (req, socket, head) => {
        //     const userIp = getClientIp(req);

        //     try {
        //         await this.jwtService.verify(req.headers);
        //         this.logger.log(`Auth good for user with IP: ${userIp}` as any);

        //         wss.handleUpgrade(req, socket, head, function done(ws) {
        //             wss.emit('connection', ws, req);
        //         });
        //     } catch (e) {
        //         if (e instanceof ValidationError) {
        //             this.logger.warn(`Auth bad for user with IP ${userIp}: ${e}`);
        //             return abortHandshake(socket, 401);
        //         } else {
        //             this.logger.error(`Auth user error: ${e.message}`, e.stack);
        //             return abortHandshake(socket, 500);
        //         }
        //     }
        // });
    }

    async handleConnection() {
        console.log('connect');
    }

    async handleDisconnect() {
        console.log('disconnect');
    }

    @SubscribeMessage('heartbeat')
    handleEvent(@MessageBody() data: string): string {
        return data;
    }
}
