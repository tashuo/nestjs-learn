import { MigrationInterface, QueryRunner } from 'typeorm';

export class FeedNumber1682754562825 implements MigrationInterface {
    name = 'FeedNumber1682754562825';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`uniq_user_post\` ON \`feeds\``);
        await queryRunner.query(`DROP INDEX \`idx_author_user\` ON \`feeds\``);
        await queryRunner.query(`DROP INDEX \`idx_publish_time_user\` ON \`feeds\``);
        await queryRunner.query(`ALTER TABLE \`feeds\` DROP COLUMN \`post_id\``);
        await queryRunner.query(
            `ALTER TABLE \`feeds\` ADD \`post_id\` int NOT NULL COMMENT '帖子ID'`,
        );
        await queryRunner.query(`ALTER TABLE \`feeds\` DROP COLUMN \`author_id\``);
        await queryRunner.query(
            `ALTER TABLE \`feeds\` ADD \`author_id\` int NOT NULL COMMENT '楼主ID'`,
        );
        await queryRunner.query(`ALTER TABLE \`feeds\` DROP COLUMN \`user_id\``);
        await queryRunner.query(
            `ALTER TABLE \`feeds\` ADD \`user_id\` int NOT NULL COMMENT '用户ID'`,
        );
        await queryRunner.query(
            `CREATE INDEX \`idx_publish_time_user\` ON \`feeds\` (\`publish_time\`, \`user_id\`)`,
        );
        await queryRunner.query(
            `CREATE INDEX \`idx_author_user\` ON \`feeds\` (\`author_id\`, \`user_id\`)`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX \`uniq_user_post\` ON \`feeds\` (\`user_id\`, \`post_id\`)`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`uniq_user_post\` ON \`feeds\``);
        await queryRunner.query(`DROP INDEX \`idx_author_user\` ON \`feeds\``);
        await queryRunner.query(`DROP INDEX \`idx_publish_time_user\` ON \`feeds\``);
        await queryRunner.query(`ALTER TABLE \`feeds\` DROP COLUMN \`user_id\``);
        await queryRunner.query(
            `ALTER TABLE \`feeds\` ADD \`user_id\` varchar(255) NOT NULL COMMENT '用户ID'`,
        );
        await queryRunner.query(`ALTER TABLE \`feeds\` DROP COLUMN \`author_id\``);
        await queryRunner.query(
            `ALTER TABLE \`feeds\` ADD \`author_id\` varchar(255) NOT NULL COMMENT '楼主ID'`,
        );
        await queryRunner.query(`ALTER TABLE \`feeds\` DROP COLUMN \`post_id\``);
        await queryRunner.query(
            `ALTER TABLE \`feeds\` ADD \`post_id\` varchar(255) NOT NULL COMMENT '帖子ID'`,
        );
        await queryRunner.query(
            `CREATE INDEX \`idx_publish_time_user\` ON \`feeds\` (\`publish_time\`, \`user_id\`)`,
        );
        await queryRunner.query(
            `CREATE INDEX \`idx_author_user\` ON \`feeds\` (\`author_id\`, \`user_id\`)`,
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX \`uniq_user_post\` ON \`feeds\` (\`user_id\`, \`post_id\`)`,
        );
    }
}
