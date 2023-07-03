import { NestContainer, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CommandModule, CommandService } from 'nestjs-command';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule, {
        // logger: ['debug'],
        logger: false,
    });
    try {
        console.log(
            Array.from(((app as any).container as unknown as NestContainer).getModules()).length,
        );
        await app.select(CommandModule).get(CommandService).exec();
        await app.close();
    } catch (error) {
        console.error(error);
        await app.close();
        process.exit(1);
    }
}

bootstrap();
