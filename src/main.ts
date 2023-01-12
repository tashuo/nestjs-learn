import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'debug', 'verbose', 'log'],
    });
    const config = app.get(ConfigService);
    console.log(config.get('TEST'));
    app.useGlobalPipes(new ValidationPipe()); // 开启数据校验
    await app.listen(3000);
}
bootstrap();
