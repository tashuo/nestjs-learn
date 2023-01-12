import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { DefaultConsumer } from './default.consumer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from './typeorm.config.service';
import { resolve } from 'path';
import { rejects } from 'assert';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { HttpExceptionFilter } from './http.exception.filter';
import { HttpException2Filter } from './http.exception2.filter';

@Module({
    imports: [
        PostModule,
        CommentModule,
        UserModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            // useClass: TypeOrmConfigService, // 同useFactory,useClass不需要inject
            useFactory: (config: ConfigService) => ({
                type: 'mysql',
                host: config.get('database.host', 'localhost'),
                port: config.get('database.port', 3306),
                username: config.get('database.username', 'root'),
                database: config.get('database.database', 'nest_blog'),
                entities: [],
                synchronize: true,
                autoLoadEntities: true,
            }),
        }),
        AuthModule,
        ConfigModule.forRoot(),
        WinstonModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                level: config.get('LOG_LEVEL', 'debug'),
                format: winston.format.combine(
                    winston.format.timestamp({
                        format: 'YYYY-MM-DD HH:mm:ss',
                    }),
                    winston.format.errors({ stack: true }),
                    winston.format.splat(),
                    winston.format.json(),
                ),
                defaultMeta: { service: 'log-service' },
                transports: [
                    //
                    // - Write all logs with importance level of `error` or less to `error.log`
                    // - Write all logs with importance level of `info` or less to `combined.log`
                    //
                    new winston.transports.File({
                        filename: config.get('ERROR_LOG', 'error.log'),
                        level: 'error',
                    }),
                    new winston.transports.File({ filename: config.get('LOG', 'app.log') }),
                ],
            }),
        }),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        ConfigService,
        TypeOrmConfigService,
        DefaultConsumer, // 注册后才会消费
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_FILTER,
            useClass: HttpException2Filter,
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule {}
