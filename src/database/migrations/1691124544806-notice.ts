import { MigrationInterface, QueryRunner } from "typeorm";

export class Notice1691124544806 implements MigrationInterface {
    name = 'Notice1691124544806'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notices\` CHANGE \`content\` \`content\` varchar(1000) NOT NULL COMMENT '内容' DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notices\` CHANGE \`content\` \`content\` varchar(1000) NOT NULL COMMENT '内容'`);
    }

}
