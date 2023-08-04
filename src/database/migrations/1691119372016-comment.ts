import { MigrationInterface, QueryRunner } from "typeorm";

export class Comment1691119372016 implements MigrationInterface {
    name = 'Comment1691119372016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comments\` CHANGE \`like_count\` \`like_count\` int NOT NULL COMMENT '点赞数' DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comments\` CHANGE \`like_count\` \`like_count\` int NOT NULL COMMENT '点赞数'`);
    }

}
