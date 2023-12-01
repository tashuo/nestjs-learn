import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from 'nestjs-config';
import { AppModule } from './app.module';
import { AuthenticatedSocketIoAdapter } from './modules/ws/authenticated.socketio.adapter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AdminModule } from './modules/admin/admin.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'debug', 'verbose', 'log'],
    });
    const config = app.get(ConfigService);
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        // transformOptions: { enableImplicitConversion: true },    // 会将所有非空字符串转换为true
    }));
    app.useWebSocketAdapter(new AuthenticatedSocketIoAdapter(app));
    app.enableCors();
    app.setGlobalPrefix('api');
    // app.init(); // 加上init会触发bull的consumer重复注册bug？

    const swaggerConfig = new DocumentBuilder()
        .setTitle('api docs')
        .setDescription('前端接口文档')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('doc', app, document);

    const swaggerConfigAdmin = new DocumentBuilder()
        .setTitle('admni api docs')
        .setDescription('后台接口文档')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const adminDocument = SwaggerModule.createDocument(app, swaggerConfigAdmin, {
        include: [AdminModule],
    });
    SwaggerModule.setup('doc-admin', app, adminDocument);

    await app.listen(config.get('app.port'));
}
bootstrap();
