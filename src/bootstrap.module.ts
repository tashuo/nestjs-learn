import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from 'nestjs-config';
import * as path from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { CommentModule } from './modules/comment/comment.module';
import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmConfigService } from './providers/typeorm.config.service';
import * as winston from 'winston';
import { TagModule } from './modules/tag/tag.module';
import { WsModule } from './modules/ws/ws.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt';

@Module({
    imports: [
        ConfigModule.load(path.resolve(__dirname, 'config', '!(*.d).{ts,js}')),
        PostModule,
        CommentModule,
        UserModule,
        TagModule,
        WsModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: TypeOrmConfigService, // 同useFactory,useClass不需要inject
        }),
        AuthModule,
        WinstonModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                level: config.get('log.level'),
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
                    new winston.transports.File({
                        filename: config.get('log.error_file'),
                        level: 'error',
                    }),
                    new winston.transports.File({
                        filename: config.get('log.app_file'),
                    }),
                ],
            }),
        }),
        {
            ...JwtModule.register({
                secret: jwtConstants.secret,
                signOptions: {
                    expiresIn: '1d',
                },
            }),
            global: true,
        },
    ],
})
export class BootstrapModule {}
