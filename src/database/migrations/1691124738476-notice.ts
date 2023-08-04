import { MigrationInterface, QueryRunner } from 'typeorm';

export class Notice1691124738476 implements MigrationInterface {
    name = 'Notice1691124738476';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`notices\` CHANGE \`content\` \`content\` varchar(1000) NOT NULL COMMENT '内容' DEFAULT ''`,
        );
        await queryRunner.query(
            `ALTER TABLE \`notices\` CHANGE \`is_read\` \`is_read\` tinyint NOT NULL COMMENT '是否已读' DEFAULT 0`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`notices\` CHANGE \`is_read\` \`is_read\` tinyint NOT NULL COMMENT '是否已读'`,
        );
        await queryRunner.query(
            `ALTER TABLE \`notices\` CHANGE \`content\` \`content\` varchar(1000) NOT NULL COMMENT '内容'`,
        );
    }
}
