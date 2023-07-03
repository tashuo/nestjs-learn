import { Command, Console, createSpinner } from 'nestjs-console';

@Console()
export class GenerateMigrationCommand {
    @Command({
        command: 'dbmg <filename>',
        description: 'generate migration',
        options: [],
    })
    async generate(filename?: string): Promise<void> {
        console.log(filename);
        const spin = createSpinner();
        spin.start(`start test ${filename}`);
        const result = await new Promise((f) => setTimeout(() => f(filename), 1000));
        spin.succeed('done!');
        console.log(result);
    }
}
