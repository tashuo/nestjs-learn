import { MigrationInterface, QueryRunner } from "typeorm";

export class SofeDelete1682694753171 implements MigrationInterface {
    name = 'SofeDelete1682694753171'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`category\` ADD \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`post_entity\` ADD \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_entity\` ADD \`deleted_at\` datetime(6) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_entity\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`post_entity\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`deleted_at\``);
    }

}
