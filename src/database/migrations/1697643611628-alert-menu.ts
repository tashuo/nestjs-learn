import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlertMenu1697643611628 implements MigrationInterface {
    name = 'AlertMenu1697643611628';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`admin_menus\` DROP COLUMN \`show\``);
        await queryRunner.query(`ALTER TABLE \`admin_menus\` DROP COLUMN \`component\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`admin_menus\` ADD \`component\` varchar(255) NOT NULL COMMENT '组件路径'`,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_menus\` ADD \`show\` tinyint NOT NULL COMMENT '是否展示' DEFAULT '0'`,
        );
    }
}
