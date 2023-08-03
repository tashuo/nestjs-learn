import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from 'nestjs-config';
import { AppModule } from './app.module';
import { AuthenticatedSocketIoAdapter } from './modules/ws/authenticated.socketio.adapter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'debug', 'verbose', 'log'],
    });
    const config = app.get(ConfigService);
    app.useGlobalPipes(new ValidationPipe());
    app.useWebSocketAdapter(new AuthenticatedSocketIoAdapter(app));
    // app.enableCors({
    //     origin: ['http://localhost:3000'],
    //     allowedHeaders: ['Origin,DNT', 'Content-Type', 'Authorization'],
    //     methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    // });
    app.setGlobalPrefix('api');
    // app.init(); // 加上init会触发bull的consumer重复注册bug？

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Cats example')
        .setDescription('The cats API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('doc', app, document);

    await app.listen(config.get('app.port'));
}
bootstrap();
