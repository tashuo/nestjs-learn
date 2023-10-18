import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterMenu1697379626755 implements MigrationInterface {
    name = 'AlterMenu1697379626755';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`admin_menus\` DROP COLUMN \`uri\``);
        await queryRunner.query(
            `ALTER TABLE \`admin_menus\` ADD \`path\` varchar(255) NOT NULL COMMENT 'path'`,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_menus\` ADD \`component\` varchar(255) NOT NULL COMMENT '组件路径'`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`admin_menus\` DROP COLUMN \`component\``);
        await queryRunner.query(`ALTER TABLE \`admin_menus\` DROP COLUMN \`path\``);
        await queryRunner.query(
            `ALTER TABLE \`admin_menus\` ADD \`uri\` varchar(255) NOT NULL COMMENT 'uri'`,
        );
    }
}
