import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostImage1690212603874 implements MigrationInterface {
    name = 'PostImage1690212603874';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`user_entity\` CHANGE \`avatar\` \`avatar_path\` varchar(255) NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_entity\` ADD \`image_paths\` varchar(255) NOT NULL COMMENT '图片路径,多个逗号分隔' DEFAULT ''`,
        );
        await queryRunner.query(`ALTER TABLE \`user_entity\` DROP COLUMN \`avatar_path\``);
        await queryRunner.query(
            `ALTER TABLE \`user_entity\` ADD \`avatar_path\` varchar(255) NOT NULL DEFAULT ''`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_entity\` DROP COLUMN \`avatar_path\``);
        await queryRunner.query(
            `ALTER TABLE \`user_entity\` ADD \`avatar_path\` varchar(255) NOT NULL`,
        );
        await queryRunner.query(`ALTER TABLE \`post_entity\` DROP COLUMN \`image_paths\``);
        await queryRunner.query(
            `ALTER TABLE \`user_entity\` CHANGE \`avatar_path\` \`avatar\` varchar(255) NOT NULL`,
        );
    }
}
