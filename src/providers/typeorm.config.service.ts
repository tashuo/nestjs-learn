import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from 'nestjs-config';
import { resolve } from 'path';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private readonly config: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            ...this.config.get('database'),
            entities: [resolve(__dirname, '../modules/**/entities/*.{js,ts}')], // 引入entity
            synchronize: false,
            autoLoadEntities: true,
        };
    }
    // createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions {
    //     const databases = this.config.get('database');
    //     const database = databases.filter((v) =>
    //         connectionName ? v.name === connectionName : isNil(v.name) || v.name === 'default',
    //     )[0];
    //     return {
    //         ...database,
    //         entities: [resolve(__dirname, '../modules/**/entities/*.{js,ts}')], // 引入entity
    //         synchronize: false,
    //         autoLoadEntities: true,
    //     };
    // }
}
