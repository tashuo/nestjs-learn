import { MigrationInterface, QueryRunner } from "typeorm";

export class User1682495785004 implements MigrationInterface {
    name = 'User1682495785004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_entity\` ADD \`avatar\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_entity\` DROP COLUMN \`avatar\``);
    }

}
