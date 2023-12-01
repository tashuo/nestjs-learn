import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as entities from './entities';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MenuRepository } from './repositories/menu.repository';
import * as controllers from './controllers';
import * as services from './services';

@Module({
    controllers: [AdminController, ...Object.values(controllers)],
    providers: [AdminService, MenuRepository, ...Object.values(services)],
    imports: [TypeOrmModule.forFeature([...Object.values(entities)])],
    exports: [AdminService, MenuRepository],
})
export class AdminModule {}
