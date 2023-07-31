import { MigrationInterface, QueryRunner } from 'typeorm';

export class CommentMpathIndex1690471077629 implements MigrationInterface {
    name = 'CommentMpathIndex1690471077629';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX \`idx_mpath\` ON \`comments\` (\`mpath\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`idx_mpath\` ON \`comments\``);
    }
}
