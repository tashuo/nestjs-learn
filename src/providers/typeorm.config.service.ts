import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from 'nestjs-config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private readonly config: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            ...this.config.get('database'),
            entities: [],
            synchronize: false,
            autoLoadEntities: true,
        };
    }
}
