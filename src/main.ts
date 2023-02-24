import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from 'nestjs-config';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'debug', 'verbose', 'log'],
    });
    const config = app.get(ConfigService);
    app.useGlobalPipes(new ValidationPipe()); // 开启数据校验

    // swagger
    const options = new DocumentBuilder()
        .setTitle('test title')
        .setDescription('test description')
        .setVersion('1.0')
        .addTag('post')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('doc', app, document);

    await app.listen(config.get('app.port'));
}
bootstrap();
