import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { BootstrapModule } from './bootstrap.module';
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
import { GenerateMigrationCommand } from './database/commands/generate.migration.command';
import { NoticeModule } from './modules/notice/notice.module';
import { RbacGuard } from './common/guards/rbac-auth.guard';
import { AdminModule } from './modules/admin/admin.module';

const providers = [];
providers.push(
    ...[
        {
            provide: APP_GUARD,
            useClass: RbacGuard,
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
        GenerateMigrationCommand,
    ],
);
if (process.env.NODE_ENV != 'test') {
    providers.push(...Object.values(jobs));
}

@Module({
    imports: [
        BootstrapModule,
        AuthModule,
        PostModule,
        CommentModule,
        UserModule,
        TagModule,
        WsModule,
        CollectModule,
        FeedModule,
        NoticeModule,
        AdminModule,
    ],
    providers: providers,
})
export class AppModule {}
