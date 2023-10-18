import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as entities from './entities';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MenuRepository } from './repositories/menu.repository';

@Module({
    controllers: [AdminController],
    providers: [AdminService, MenuRepository],
    imports: [TypeOrmModule.forFeature([...Object.values(entities)])],
    exports: [AdminService, MenuRepository],
})
export class AdminModule {}
