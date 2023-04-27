import { MigrationInterface, QueryRunner } from "typeorm";

export class Feed1682521354872 implements MigrationInterface {
    name = 'Feed1682521354872'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`collects\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL COMMENT '收藏夹名称', \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '删除时间', \`userId\` int NOT NULL, INDEX \`idx_uid\` (\`userId\`), FULLTEXT INDEX \`IDX_6410fa7b2fc30394af2cc9744d\` (\`title\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`feeds\` (\`id\` int NOT NULL AUTO_INCREMENT, \`post_id\` varchar(255) NOT NULL COMMENT '帖子ID', \`author_id\` varchar(255) NOT NULL COMMENT '楼主ID', \`user_id\` varchar(255) NOT NULL COMMENT '用户ID', \`publish_time\` int UNSIGNED NOT NULL COMMENT '发布时间戳', INDEX \`idx_publish_time_user\` (\`publish_time\`, \`user_id\`), INDEX \`idx_author_user\` (\`author_id\`, \`user_id\`), UNIQUE INDEX \`uniq_user_post\` (\`user_id\`, \`post_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`collects\` ADD CONSTRAINT \`FK_1b3d95e3f902fc5f570e9707282\` FOREIGN KEY (\`userId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`collects\` DROP FOREIGN KEY \`FK_1b3d95e3f902fc5f570e9707282\``);
        await queryRunner.query(`DROP INDEX \`uniq_user_post\` ON \`feeds\``);
        await queryRunner.query(`DROP INDEX \`idx_author_user\` ON \`feeds\``);
        await queryRunner.query(`DROP INDEX \`idx_publish_time_user\` ON \`feeds\``);
        await queryRunner.query(`DROP TABLE \`feeds\``);
        await queryRunner.query(`DROP INDEX \`IDX_6410fa7b2fc30394af2cc9744d\` ON \`collects\``);
        await queryRunner.query(`DROP INDEX \`idx_uid\` ON \`collects\``);
        await queryRunner.query(`DROP TABLE \`collects\``);
    }

}
