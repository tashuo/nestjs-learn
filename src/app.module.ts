import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { BootstrapModule } from './bootstrap.module';
import { DefaultConsumer } from './jobs/default.consumer';
import { HttpException2Filter } from './common/filters/http.exception2.filter';
import { HttpExceptionFilter } from './common/filters/http.exception.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { TagModule } from './modules/tag/tag.module';

@Module({
    imports: [BootstrapModule, TagModule],
    providers: [
        // DefaultConsumer, // 注册后才会消费
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
