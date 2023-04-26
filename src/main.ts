import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from 'nestjs-config';
import { AppModule } from './app.module';
import { AuthenticatedSocketIoAdapter } from './modules/ws/authenticated.socketio.adapter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'debug', 'verbose', 'log'],
    });
    const config = app.get(ConfigService);
    app.useGlobalPipes(new ValidationPipe());
    app.useWebSocketAdapter(new AuthenticatedSocketIoAdapter(app));
    app.init();

    await app.listen(config.get('app.port'));
}
bootstrap();
