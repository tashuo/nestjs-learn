import { MigrationInterface, QueryRunner } from 'typeorm';

export class Collect1682589199602 implements MigrationInterface {
    name = 'Collect1682589199602';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`collect_posts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`remark\` varchar(255) NOT NULL COMMENT '备注', \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`collectId\` int NULL, \`postId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_entity\` ADD \`comment_count\` int NOT NULL COMMENT '评论数'`,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_entity\` ADD \`like_count\` int NOT NULL COMMENT '点赞数'`,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_entity\` ADD \`repost_count\` int NOT NULL COMMENT '转发数'`,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_entity\` ADD \`collect_count\` int NOT NULL COMMENT '收藏数'`,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_entity\` ADD \`detail_count\` int NOT NULL COMMENT '详情页浏览数'`,
        );
        await queryRunner.query(
            `CREATE INDEX \`IDX_96fcac0a31e5cb86357aae7f0d\` ON \`post_entity\` (\`comment_count\`)`,
        );
        await queryRunner.query(
            `CREATE INDEX \`IDX_14a22293494ffe29a7de6af5bd\` ON \`post_entity\` (\`like_count\`)`,
        );
        await queryRunner.query(
            `CREATE INDEX \`IDX_74b998ec1edaac0b4b318fef4b\` ON \`post_entity\` (\`detail_count\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`collect_posts\` ADD CONSTRAINT \`FK_4411804767a2b281de3ea78964e\` FOREIGN KEY (\`collectId\`) REFERENCES \`collects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`collect_posts\` ADD CONSTRAINT \`FK_6a5fd455e5473286061747998de\` FOREIGN KEY (\`postId\`) REFERENCES \`post_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`collect_posts\` DROP FOREIGN KEY \`FK_6a5fd455e5473286061747998de\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`collect_posts\` DROP FOREIGN KEY \`FK_4411804767a2b281de3ea78964e\``,
        );
        await queryRunner.query(`DROP INDEX \`IDX_74b998ec1edaac0b4b318fef4b\` ON \`post_entity\``);
        await queryRunner.query(`DROP INDEX \`IDX_14a22293494ffe29a7de6af5bd\` ON \`post_entity\``);
        await queryRunner.query(`DROP INDEX \`IDX_96fcac0a31e5cb86357aae7f0d\` ON \`post_entity\``);
        await queryRunner.query(`ALTER TABLE \`post_entity\` DROP COLUMN \`detail_count\``);
        await queryRunner.query(`ALTER TABLE \`post_entity\` DROP COLUMN \`collect_count\``);
        await queryRunner.query(`ALTER TABLE \`post_entity\` DROP COLUMN \`repost_count\``);
        await queryRunner.query(`ALTER TABLE \`post_entity\` DROP COLUMN \`like_count\``);
        await queryRunner.query(`ALTER TABLE \`post_entity\` DROP COLUMN \`comment_count\``);
        await queryRunner.query(`DROP TABLE \`collect_posts\``);
    }
}
