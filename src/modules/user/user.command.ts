import { Command, Console, createSpinner } from 'nestjs-console';

@Console()
export class UserCommand {
    @Command({
        command: 'output <something>',
        description: '测试一下',
        options: [
            {
                flags: '-o1, --option1 <o1Value>',
                required: false,
                description: '母鸡',
            },
            {
                flags: '-o2, --option2 <o1Value>',
                required: false,
            },
        ],
    })
    async test(s: number, options: any): Promise<void> {
        console.log(options);
        const spin = createSpinner();
        spin.start(`start test ${s}`);
        const result = await new Promise((f) => setTimeout(() => f(s), 1000));
        spin.succeed('done!');
        console.log(result);
    }
}
