import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TestCommand {
    @Command({
        command: 'create:user <username>',
        describe: 'create a user',
    })
    async create(username: string, group?: string, saber?: string) {
        console.log(username, group, saber);
    }
}
