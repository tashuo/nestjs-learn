import { MigrationInterface, QueryRunner } from 'typeorm';

export class Github1690967032976 implements MigrationInterface {
    name = 'Github1690967032976';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`user_entity\` ADD \`github_id\` int NOT NULL DEFAULT '0'`,
        );
        await queryRunner.query(`ALTER TABLE \`user_entity\` ADD \`github_user\` json NULL`);
        await queryRunner.query(
            `CREATE INDEX \`IDX_75e3a27b2e8d8c5f4033db2004\` ON \`user_entity\` (\`github_id\`)`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_75e3a27b2e8d8c5f4033db2004\` ON \`user_entity\``);
        await queryRunner.query(`ALTER TABLE \`user_entity\` DROP COLUMN \`github_user\``);
        await queryRunner.query(`ALTER TABLE \`user_entity\` DROP COLUMN \`github_id\``);
    }
}
