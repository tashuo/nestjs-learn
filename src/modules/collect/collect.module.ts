import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectEntity, CollectPostEntity } from './entities/collect.entity';
import { CollectService } from './collect.service';
import { CollectController } from './collect.controller';

@Module({
    imports: [TypeOrmModule.forFeature([CollectEntity, CollectPostEntity])],
    controllers: [CollectController],
    providers: [CollectService],
})
export class CollectModule {}
