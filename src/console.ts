import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CommandModule, CommandService } from 'nest-commands';

async function bootstrap() {
    try {
        const app = await NestFactory.createApplicationContext(AppModule, {
            // logger: ['debug'],
            logger: false,
        });
        await app.select(CommandModule).get(CommandService).init().exec();
        await app.close();
    } catch (error) {
        console.error(error);
    }
    process.exit(1);
}

bootstrap();
