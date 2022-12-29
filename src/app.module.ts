import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { DefaultConsumer } from './default.consumer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from './typeorm.config.service';

@Module({
    imports: [
        PostModule,
        CommentModule,
        UserModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useClass: TypeOrmConfigService, // 同useFactory
            // useFactory: (config: ConfigService) => ({
            //     type: 'mysql',
            //     host: config.get('database.host', 'localhost'),
            //     port: config.get('database.port', 3306),
            //     username: config.get('database.username', 'root'),
            //     database: config.get('database.database', 'nest_blog'),
            //     entities: [],
            //     synchronize: true,
            //     autoLoadEntities: true,
            // }),
        }),
        AuthModule,
        ConfigModule.forRoot(),
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
    ],
})
export class AppModule {}
