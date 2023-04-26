import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1682487390028 implements MigrationInterface {
    name = 'User1682487390028';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_entity\` DROP COLUMN \`password\``);
        await queryRunner.query(
            `ALTER TABLE \`user_entity\` ADD \`password\` varchar(255) NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_entity\` DROP COLUMN \`password\``);
        await queryRunner.query(`ALTER TABLE \`user_entity\` ADD \`password\` char(32) NOT NULL`);
    }
}
