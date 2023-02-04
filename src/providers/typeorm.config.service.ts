import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from 'nestjs-config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private readonly config: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: this.config.get('database.host'),
            port: this.config.get('database.port'),
            username: this.config.get('database.username'),
            database: this.config.get('database.database'),
            entities: [],
            synchronize: true,
            autoLoadEntities: true,
        };
    }
}
