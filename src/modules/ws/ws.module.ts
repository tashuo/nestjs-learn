import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { WsService } from './ws.service';
@Module({
    providers: [EventGateway, WsService],
    exports: [WsService],
})
export class WsModule {}
