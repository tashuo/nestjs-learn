import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { BootstrapModule } from './bootstrap.module';
import { DefaultConsumer } from './jobs/default.consumer';
import { HttpException2Filter } from './common/filters/http.exception2.filter';
import { HttpExceptionFilter } from './common/filters/http.exception.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { TagModule } from './modules/tag/tag.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';
import { UserModule } from './modules/user/user.module';
import { WsModule } from './modules/ws/ws.module';
import { FeedModule } from './modules/feed/feed.module';
import { CollectModule } from './modules/collect/collect.module';
import { AuthModule } from './modules/auth/auth.module';
import * as jobs from './jobs';

@Module({
    imports: [
        BootstrapModule,
        AuthModule,
        PostModule,
        CommentModule,
        UserModule,
        TagModule,
        WsModule,
        FeedModule,
        CollectModule,
    ],
    providers: [
        // DefaultConsumer, // 注册后才会消费
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
        ...Object.values(jobs),
    ],
})
export class AppModule {}
