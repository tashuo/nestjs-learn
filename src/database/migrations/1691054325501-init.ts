import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1691054325501 implements MigrationInterface {
    name = 'Init1691054325501';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`tag\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NOT NULL, INDEX \`IDX_d0dc39ff83e384b4a097f47d3f\` (\`userId\`), UNIQUE INDEX \`IDX_6a9775008add570dc3e5a0bab7\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`user_followers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`create_time\` int UNSIGNED NOT NULL COMMENT '关注时间戳', \`userId\` int NULL, \`followerId\` int NULL, UNIQUE INDEX \`uniq_user_follower_id\` (\`userId\`, \`followerId\`), INDEX \`idx_follower_uid\` (\`followerId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`user_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`github_id\` int NOT NULL DEFAULT '0', \`github_user\` json NULL, \`username\` varchar(255) NOT NULL, \`nickname\` varchar(255) NOT NULL, \`avatar_path\` varchar(255) NOT NULL DEFAULT '', \`gender\` varchar(255) NOT NULL DEFAULT '未知', \`description\` varchar(255) NOT NULL DEFAULT '', \`password\` varchar(255) NOT NULL DEFAULT '', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, INDEX \`IDX_75e3a27b2e8d8c5f4033db2004\` (\`github_id\`), UNIQUE INDEX \`IDX_9b998bada7cff93fcb953b0c37\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`post_extra\` (\`post_id\` int NOT NULL, \`like_counts\` int NOT NULL, \`comment_counts\` int NOT NULL, PRIMARY KEY (\`post_id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`post_to_category\` (\`postToCategoryId\` int NOT NULL AUTO_INCREMENT, \`postId\` int NOT NULL, \`categoryId\` int NOT NULL, \`order\` int NOT NULL, PRIMARY KEY (\`postToCategoryId\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`text\` varchar(255) NOT NULL, \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`post_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`image_paths\` varchar(255) NOT NULL COMMENT '图片路径,多个逗号分隔' DEFAULT '', \`content_type\` enum ('html', 'markdown', 'text') NOT NULL DEFAULT 'text', \`status\` enum ('normal', 'delete') NOT NULL DEFAULT 'normal', \`comment_count\` int NOT NULL COMMENT '评论数', \`like_count\` int NOT NULL COMMENT '点赞数', \`repost_count\` int NOT NULL COMMENT '转发数', \`collect_count\` int NOT NULL COMMENT '收藏数', \`detail_count\` int NOT NULL COMMENT '详情页浏览数', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`userId\` int NOT NULL, INDEX \`IDX_5e32998d7ac08f573cde04fbfa\` (\`userId\`), INDEX \`IDX_96fcac0a31e5cb86357aae7f0d\` (\`comment_count\`), INDEX \`IDX_14a22293494ffe29a7de6af5bd\` (\`like_count\`), INDEX \`IDX_74b998ec1edaac0b4b318fef4b\` (\`detail_count\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`comments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`like_count\` int NOT NULL COMMENT '点赞数', \`reply_count\` int NOT NULL COMMENT '回复数量，只有根节点存储该值' DEFAULT '0', \`mpath\` varchar(255) NULL DEFAULT '', \`postId\` int NOT NULL, \`userId\` int NOT NULL, \`parentId\` int NULL, INDEX \`IDX_e44ddaaa6d058cb4092f83ad61\` (\`postId\`), INDEX \`IDX_7e8d7c49f218ebb14314fdb374\` (\`userId\`), INDEX \`IDX_45fc7b7794b2a5a6de50648a79\` (\`like_count\`), INDEX \`IDX_02a459982cd42bf377068322b3\` (\`reply_count\`), INDEX \`idx_mpath\` (\`mpath\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`feeds\` (\`id\` int NOT NULL AUTO_INCREMENT, \`post_id\` int NOT NULL COMMENT '帖子ID', \`author_id\` int NOT NULL COMMENT '楼主ID', \`user_id\` int NOT NULL COMMENT '用户ID', \`publish_time\` int UNSIGNED NOT NULL COMMENT '发布时间戳', INDEX \`idx_publish_time_user\` (\`publish_time\`, \`user_id\`), INDEX \`idx_author_user\` (\`author_id\`, \`user_id\`), UNIQUE INDEX \`uniq_user_post\` (\`user_id\`, \`post_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`collects\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL COMMENT '收藏夹名称', \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL COMMENT '删除时间', \`userId\` int NOT NULL, INDEX \`idx_uid\` (\`userId\`), FULLTEXT INDEX \`IDX_6410fa7b2fc30394af2cc9744d\` (\`title\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`collect_posts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`remark\` varchar(255) NOT NULL COMMENT '备注', \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`collectId\` int NULL, \`postId\` int NULL, UNIQUE INDEX \`uniq_collect_post\` (\`collectId\`, \`postId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`comment_likes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NULL, \`commentId\` int NULL, UNIQUE INDEX \`uniq_user_comment\` (\`userId\`, \`commentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`notices\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('follow', 'like', 'collect', 'comment') NOT NULL COMMENT '类型', \`content\` varchar(1000) NOT NULL COMMENT '内容', \`is_read\` tinyint NOT NULL COMMENT '是否已读', \`created_at\` datetime(6) NOT NULL COMMENT '创建日期' DEFAULT CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`userId\` int NULL, \`operatorId\` int NULL, \`postId\` int NULL, \`commentId\` int NULL, INDEX \`idx_user_type_created\` (\`userId\`, \`type\`, \`created_at\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`post_likes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NULL, \`postId\` int NULL, UNIQUE INDEX \`uniq_user_post\` (\`userId\`, \`postId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`user_entity_followers_user_entity\` (\`userEntityId_1\` int NOT NULL, \`userEntityId_2\` int NOT NULL, INDEX \`IDX_0cfac94a7190e05681bd30031b\` (\`userEntityId_1\`), INDEX \`IDX_f218c630db489c465aa55e55ae\` (\`userEntityId_2\`), PRIMARY KEY (\`userEntityId_1\`, \`userEntityId_2\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`category_posts_post_entity\` (\`categoryId\` int NOT NULL, \`postEntityId\` int NOT NULL, INDEX \`IDX_8c9c125a5f88531cc63059f898\` (\`categoryId\`), INDEX \`IDX_7b80ef4fbfb55d12ddb367a0c2\` (\`postEntityId\`), PRIMARY KEY (\`categoryId\`, \`postEntityId\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`post_entity_tags_tag\` (\`postEntityId\` int NOT NULL, \`tagId\` varchar(36) NOT NULL, INDEX \`IDX_30d145f2cb22c758e78c4ba74e\` (\`postEntityId\`), INDEX \`IDX_89178b840f4e5a3e7481f3e58d\` (\`tagId\`), PRIMARY KEY (\`postEntityId\`, \`tagId\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`tag\` ADD CONSTRAINT \`FK_d0dc39ff83e384b4a097f47d3f5\` FOREIGN KEY (\`userId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_followers\` ADD CONSTRAINT \`FK_347ce7a07457528a1779da8b8f3\` FOREIGN KEY (\`userId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_followers\` ADD CONSTRAINT \`FK_c3f56a3157b50bc8adcc6acf278\` FOREIGN KEY (\`followerId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_extra\` ADD CONSTRAINT \`FK_8ad3325022ede59c17c228d915e\` FOREIGN KEY (\`post_id\`) REFERENCES \`post_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_to_category\` ADD CONSTRAINT \`FK_9dab22c49ca441a85b5d1305342\` FOREIGN KEY (\`postId\`) REFERENCES \`post_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_to_category\` ADD CONSTRAINT \`FK_9d072d7c8d7909a5474fee7bbae\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_entity\` ADD CONSTRAINT \`FK_5e32998d7ac08f573cde04fbfa5\` FOREIGN KEY (\`userId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_e44ddaaa6d058cb4092f83ad61f\` FOREIGN KEY (\`postId\`) REFERENCES \`post_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_7e8d7c49f218ebb14314fdb3749\` FOREIGN KEY (\`userId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_8770bd9030a3d13c5f79a7d2e81\` FOREIGN KEY (\`parentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`collects\` ADD CONSTRAINT \`FK_1b3d95e3f902fc5f570e9707282\` FOREIGN KEY (\`userId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`collect_posts\` ADD CONSTRAINT \`FK_4411804767a2b281de3ea78964e\` FOREIGN KEY (\`collectId\`) REFERENCES \`collects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`collect_posts\` ADD CONSTRAINT \`FK_6a5fd455e5473286061747998de\` FOREIGN KEY (\`postId\`) REFERENCES \`post_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`comment_likes\` ADD CONSTRAINT \`FK_34d1f902a8a527dbc2502f87c88\` FOREIGN KEY (\`userId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`comment_likes\` ADD CONSTRAINT \`FK_abbd506a94a424dd6a3a68d26f4\` FOREIGN KEY (\`commentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`notices\` ADD CONSTRAINT \`FK_79364067097eea7912bb08855b6\` FOREIGN KEY (\`userId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`notices\` ADD CONSTRAINT \`FK_33cc34d83dafa017a42e977f3f3\` FOREIGN KEY (\`operatorId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`notices\` ADD CONSTRAINT \`FK_0f6eddabf51a7a71abf0befc2c8\` FOREIGN KEY (\`postId\`) REFERENCES \`post_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`notices\` ADD CONSTRAINT \`FK_2fee6b75e702c6aa393110dfafc\` FOREIGN KEY (\`commentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_likes\` ADD CONSTRAINT \`FK_37d337ad54b1aa6b9a44415a498\` FOREIGN KEY (\`userId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_likes\` ADD CONSTRAINT \`FK_6999d13aca25e33515210abaf16\` FOREIGN KEY (\`postId\`) REFERENCES \`post_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_entity_followers_user_entity\` ADD CONSTRAINT \`FK_0cfac94a7190e05681bd30031b5\` FOREIGN KEY (\`userEntityId_1\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_entity_followers_user_entity\` ADD CONSTRAINT \`FK_f218c630db489c465aa55e55ae2\` FOREIGN KEY (\`userEntityId_2\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`category_posts_post_entity\` ADD CONSTRAINT \`FK_8c9c125a5f88531cc63059f8986\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`category_posts_post_entity\` ADD CONSTRAINT \`FK_7b80ef4fbfb55d12ddb367a0c28\` FOREIGN KEY (\`postEntityId\`) REFERENCES \`post_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_entity_tags_tag\` ADD CONSTRAINT \`FK_30d145f2cb22c758e78c4ba74ed\` FOREIGN KEY (\`postEntityId\`) REFERENCES \`post_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_entity_tags_tag\` ADD CONSTRAINT \`FK_89178b840f4e5a3e7481f3e58d8\` FOREIGN KEY (\`tagId\`) REFERENCES \`tag\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`post_entity_tags_tag\` DROP FOREIGN KEY \`FK_89178b840f4e5a3e7481f3e58d8\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_entity_tags_tag\` DROP FOREIGN KEY \`FK_30d145f2cb22c758e78c4ba74ed\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`category_posts_post_entity\` DROP FOREIGN KEY \`FK_7b80ef4fbfb55d12ddb367a0c28\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`category_posts_post_entity\` DROP FOREIGN KEY \`FK_8c9c125a5f88531cc63059f8986\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_entity_followers_user_entity\` DROP FOREIGN KEY \`FK_f218c630db489c465aa55e55ae2\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_entity_followers_user_entity\` DROP FOREIGN KEY \`FK_0cfac94a7190e05681bd30031b5\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_likes\` DROP FOREIGN KEY \`FK_6999d13aca25e33515210abaf16\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_likes\` DROP FOREIGN KEY \`FK_37d337ad54b1aa6b9a44415a498\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`notices\` DROP FOREIGN KEY \`FK_2fee6b75e702c6aa393110dfafc\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`notices\` DROP FOREIGN KEY \`FK_0f6eddabf51a7a71abf0befc2c8\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`notices\` DROP FOREIGN KEY \`FK_33cc34d83dafa017a42e977f3f3\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`notices\` DROP FOREIGN KEY \`FK_79364067097eea7912bb08855b6\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`comment_likes\` DROP FOREIGN KEY \`FK_abbd506a94a424dd6a3a68d26f4\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`comment_likes\` DROP FOREIGN KEY \`FK_34d1f902a8a527dbc2502f87c88\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`collect_posts\` DROP FOREIGN KEY \`FK_6a5fd455e5473286061747998de\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`collect_posts\` DROP FOREIGN KEY \`FK_4411804767a2b281de3ea78964e\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`collects\` DROP FOREIGN KEY \`FK_1b3d95e3f902fc5f570e9707282\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_8770bd9030a3d13c5f79a7d2e81\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_7e8d7c49f218ebb14314fdb3749\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_e44ddaaa6d058cb4092f83ad61f\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_entity\` DROP FOREIGN KEY \`FK_5e32998d7ac08f573cde04fbfa5\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_to_category\` DROP FOREIGN KEY \`FK_9d072d7c8d7909a5474fee7bbae\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_to_category\` DROP FOREIGN KEY \`FK_9dab22c49ca441a85b5d1305342\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_extra\` DROP FOREIGN KEY \`FK_8ad3325022ede59c17c228d915e\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_followers\` DROP FOREIGN KEY \`FK_c3f56a3157b50bc8adcc6acf278\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_followers\` DROP FOREIGN KEY \`FK_347ce7a07457528a1779da8b8f3\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`tag\` DROP FOREIGN KEY \`FK_d0dc39ff83e384b4a097f47d3f5\``,
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_89178b840f4e5a3e7481f3e58d\` ON \`post_entity_tags_tag\``,
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_30d145f2cb22c758e78c4ba74e\` ON \`post_entity_tags_tag\``,
        );
        await queryRunner.query(`DROP TABLE \`post_entity_tags_tag\``);
        await queryRunner.query(
            `DROP INDEX \`IDX_7b80ef4fbfb55d12ddb367a0c2\` ON \`category_posts_post_entity\``,
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_8c9c125a5f88531cc63059f898\` ON \`category_posts_post_entity\``,
        );
        await queryRunner.query(`DROP TABLE \`category_posts_post_entity\``);
        await queryRunner.query(
            `DROP INDEX \`IDX_f218c630db489c465aa55e55ae\` ON \`user_entity_followers_user_entity\``,
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_0cfac94a7190e05681bd30031b\` ON \`user_entity_followers_user_entity\``,
        );
        await queryRunner.query(`DROP TABLE \`user_entity_followers_user_entity\``);
        await queryRunner.query(`DROP INDEX \`uniq_user_post\` ON \`post_likes\``);
        await queryRunner.query(`DROP TABLE \`post_likes\``);
        await queryRunner.query(`DROP INDEX \`idx_user_type_created\` ON \`notices\``);
        await queryRunner.query(`DROP TABLE \`notices\``);
        await queryRunner.query(`DROP INDEX \`uniq_user_comment\` ON \`comment_likes\``);
        await queryRunner.query(`DROP TABLE \`comment_likes\``);
        await queryRunner.query(`DROP INDEX \`uniq_collect_post\` ON \`collect_posts\``);
        await queryRunner.query(`DROP TABLE \`collect_posts\``);
        await queryRunner.query(`DROP INDEX \`IDX_6410fa7b2fc30394af2cc9744d\` ON \`collects\``);
        await queryRunner.query(`DROP INDEX \`idx_uid\` ON \`collects\``);
        await queryRunner.query(`DROP TABLE \`collects\``);
        await queryRunner.query(`DROP INDEX \`uniq_user_post\` ON \`feeds\``);
        await queryRunner.query(`DROP INDEX \`idx_author_user\` ON \`feeds\``);
        await queryRunner.query(`DROP INDEX \`idx_publish_time_user\` ON \`feeds\``);
        await queryRunner.query(`DROP TABLE \`feeds\``);
        await queryRunner.query(`DROP INDEX \`idx_mpath\` ON \`comments\``);
        await queryRunner.query(`DROP INDEX \`IDX_02a459982cd42bf377068322b3\` ON \`comments\``);
        await queryRunner.query(`DROP INDEX \`IDX_45fc7b7794b2a5a6de50648a79\` ON \`comments\``);
        await queryRunner.query(`DROP INDEX \`IDX_7e8d7c49f218ebb14314fdb374\` ON \`comments\``);
        await queryRunner.query(`DROP INDEX \`IDX_e44ddaaa6d058cb4092f83ad61\` ON \`comments\``);
        await queryRunner.query(`DROP TABLE \`comments\``);
        await queryRunner.query(`DROP INDEX \`IDX_74b998ec1edaac0b4b318fef4b\` ON \`post_entity\``);
        await queryRunner.query(`DROP INDEX \`IDX_14a22293494ffe29a7de6af5bd\` ON \`post_entity\``);
        await queryRunner.query(`DROP INDEX \`IDX_96fcac0a31e5cb86357aae7f0d\` ON \`post_entity\``);
        await queryRunner.query(`DROP INDEX \`IDX_5e32998d7ac08f573cde04fbfa\` ON \`post_entity\``);
        await queryRunner.query(`DROP TABLE \`post_entity\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`post_to_category\``);
        await queryRunner.query(`DROP TABLE \`post_extra\``);
        await queryRunner.query(`DROP INDEX \`IDX_9b998bada7cff93fcb953b0c37\` ON \`user_entity\``);
        await queryRunner.query(`DROP INDEX \`IDX_75e3a27b2e8d8c5f4033db2004\` ON \`user_entity\``);
        await queryRunner.query(`DROP TABLE \`user_entity\``);
        await queryRunner.query(`DROP INDEX \`idx_follower_uid\` ON \`user_followers\``);
        await queryRunner.query(`DROP INDEX \`uniq_user_follower_id\` ON \`user_followers\``);
        await queryRunner.query(`DROP TABLE \`user_followers\``);
        await queryRunner.query(`DROP INDEX \`IDX_6a9775008add570dc3e5a0bab7\` ON \`tag\``);
        await queryRunner.query(`DROP INDEX \`IDX_d0dc39ff83e384b4a097f47d3f\` ON \`tag\``);
        await queryRunner.query(`DROP TABLE \`tag\``);
    }
}
