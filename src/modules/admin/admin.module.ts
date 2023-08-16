import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as entities from './entities';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
    controllers: [AdminController],
    providers: [AdminService],
    imports: [TypeOrmModule.forFeature([...Object.values(entities)])],
    exports: [AdminService],
})
export class AdminModule {}
