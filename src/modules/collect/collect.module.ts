import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectEntity } from './entities/collect.entity';
import { CollectService } from './collect.service';
import { CollectController } from './collect.controller';

@Module({
    imports: [TypeOrmModule.forFeature([CollectEntity])],
    controllers: [CollectController],
    providers: [CollectService],
})
export class CollectModule {}
