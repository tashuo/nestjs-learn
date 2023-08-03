import { Inject, Injectable, UnauthorizedException, UseFilters, UseGuards } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WsResponse,
} from '@nestjs/websockets';

import { Server } from 'socket.io';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { JwtService } from '@nestjs/jwt';
import { SocketWithUserData } from './types';
import { Observable, of } from 'rxjs';
import { WsService } from './ws.service';
import { WsAuthGuard } from 'src/common/guards/ws-auth.guard';
import { BadRequestTransformationFilter } from './BadRequestTransformation.filter';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConnectedEvent } from './events/connected.event';

@Injectable()
@UseFilters(BadRequestTransformationFilter)
@UseGuards(WsAuthGuard)
@WebSocketGateway(3002, { cors: true, transports: ['polling', 'websocket'] })
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly jwtService: JwtService,
        private readonly wsService: WsService,
        private readonly eventEmiter: EventEmitter2,
    ) {}

    async afterInit(ws: Server) {
        console.log('after init');
        this.wsService.setServer(ws);
    }

    async handleConnection(client: SocketWithUserData) {
        try {
            const token = client.handshake.headers.authorization.replace('Bearer ', '');
            const { userId } = (await this.jwtService.decode(token)) as any;
            client.user = {
                id: userId,
                lastActiveTime: client.handshake.issued,
            };
            this.wsService.addUserSocket(userId, client);
        } catch (error) {
            console.log('connection error');
            console.log(error);
            throw new UnauthorizedException();
        }

        console.log('connect ' + client.user.id);
        this.eventEmiter.emit(
            'ws.connected',
            new ConnectedEvent({
                userId: client.user.id,
            }),
        );
    }

    async handleDisconnect(client: SocketWithUserData) {
        this.wsService.removeUserSocket(client.user.id);
        console.log('disconnect');
    }

    @SubscribeMessage('heartbeat')
    heartbeat(@ConnectedSocket() client: SocketWithUserData): Observable<WsResponse<number> | any> {
        console.log(
            `heartbeat: ${client.user.id} : ${this.wsService.getUserSocketId(client.user.id)}`,
        );
        client.user.lastActiveTime = Date.now();
        return of(client.user);
    }

    @SubscribeMessage('chat')
    chat(
        @ConnectedSocket() client: SocketWithUserData,
        @MessageBody() data: any,
    ): Observable<WsResponse<number> | any> {
        console.log(`send message: ${data.message}`);
        this.wsService.pushMessageToUser(data.toUserId, 'chat', data.message);
        return;
    }
}
