import { Command } from 'nest-commands';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TestCommand {
    @Command()
    async create(username: string, group?: string, saber = 'saber') {
        console.log('TestCommand', username, group, saber);
    }
}
