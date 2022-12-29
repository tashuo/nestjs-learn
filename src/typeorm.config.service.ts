import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: this.configService.get('database.host', 'localhost'),
            port: this.configService.get('database.port', 3306),
            username: this.configService.get('database.username', 'root'),
            database: this.configService.get('database.database', 'nest_blog'),
            entities: [],
            synchronize: true,
            autoLoadEntities: true,
        };
    }
}
