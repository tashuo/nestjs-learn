import { MigrationInterface, QueryRunner } from 'typeorm';

export class CommentLike1690455271120 implements MigrationInterface {
    name = 'CommentLike1690455271120';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`comment_likes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NULL, \`commentId\` int NULL, UNIQUE INDEX \`uniq_user_comment\` (\`userId\`, \`commentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`comments\` ADD \`like_count\` int NOT NULL COMMENT '点赞数'`,
        );
        await queryRunner.query(
            `CREATE INDEX \`IDX_45fc7b7794b2a5a6de50648a79\` ON \`comments\` (\`like_count\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`comment_likes\` ADD CONSTRAINT \`FK_34d1f902a8a527dbc2502f87c88\` FOREIGN KEY (\`userId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`comment_likes\` ADD CONSTRAINT \`FK_abbd506a94a424dd6a3a68d26f4\` FOREIGN KEY (\`commentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`comment_likes\` DROP FOREIGN KEY \`FK_abbd506a94a424dd6a3a68d26f4\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`comment_likes\` DROP FOREIGN KEY \`FK_34d1f902a8a527dbc2502f87c88\``,
        );
        await queryRunner.query(`DROP INDEX \`IDX_45fc7b7794b2a5a6de50648a79\` ON \`comments\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`like_count\``);
        await queryRunner.query(`DROP INDEX \`uniq_user_comment\` ON \`comment_likes\``);
        await queryRunner.query(`DROP TABLE \`comment_likes\``);
    }
}
