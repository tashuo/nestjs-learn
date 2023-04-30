import { MigrationInterface, QueryRunner } from "typeorm";

export class CollectIndex1682589476959 implements MigrationInterface {
    name = 'CollectIndex1682589476959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`uniq_collect_post\` ON \`collect_posts\` (\`collectId\`, \`postId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`uniq_collect_post\` ON \`collect_posts\``);
    }

}
