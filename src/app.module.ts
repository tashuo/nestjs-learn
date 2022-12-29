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

@Module({
    imports: [
        PostModule,
        CommentModule,
        UserModule,
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            database: 'nest_blog',
            entities: [],
            synchronize: true,
            autoLoadEntities: true,
        }),
        AuthModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        DefaultConsumer, // 注册后才能消费
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
