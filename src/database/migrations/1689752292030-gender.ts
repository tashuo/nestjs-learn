import { MigrationInterface, QueryRunner } from "typeorm";

export class Gender1689752292030 implements MigrationInterface {
    name = 'Gender1689752292030'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_entity\` ADD \`gender\` varchar(255) NOT NULL DEFAULT '未知'`);
        await queryRunner.query(`ALTER TABLE \`user_entity\` ADD \`description\` varchar(255) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_entity\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`user_entity\` DROP COLUMN \`gender\``);
    }

}
