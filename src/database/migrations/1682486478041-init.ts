import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1682486478041 implements MigrationInterface {
    name = 'Init1682486478041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`post_extra\` (\`post_id\` int NOT NULL, \`like_counts\` int NOT NULL, \`comment_counts\` int NOT NULL, PRIMARY KEY (\`post_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tag\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NOT NULL, INDEX \`IDX_d0dc39ff83e384b4a097f47d3f\` (\`userId\`), UNIQUE INDEX \`IDX_6a9775008add570dc3e5a0bab7\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`post_to_category\` (\`postToCategoryId\` int NOT NULL AUTO_INCREMENT, \`postId\` int NOT NULL, \`categoryId\` int NOT NULL, \`order\` int NOT NULL, PRIMARY KEY (\`postToCategoryId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`text\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_followers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`create_time\` int UNSIGNED NOT NULL COMMENT '关注时间戳', \`userId\` int NULL, \`followerId\` int NULL, UNIQUE INDEX \`uniq_user_follower_id\` (\`userId\`, \`followerId\`), INDEX \`idx_follower_uid\` (\`followerId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`post_extra\` ADD CONSTRAINT \`FK_8ad3325022ede59c17c228d915e\` FOREIGN KEY (\`post_id\`) REFERENCES \`post_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tag\` ADD CONSTRAINT \`FK_d0dc39ff83e384b4a097f47d3f5\` FOREIGN KEY (\`userId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`post_to_category\` ADD CONSTRAINT \`FK_9dab22c49ca441a85b5d1305342\` FOREIGN KEY (\`postId\`) REFERENCES \`post_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_to_category\` ADD CONSTRAINT \`FK_9d072d7c8d7909a5474fee7bbae\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_entity\` ADD CONSTRAINT \`FK_5e32998d7ac08f573cde04fbfa5\` FOREIGN KEY (\`userId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_followers\` ADD CONSTRAINT \`FK_347ce7a07457528a1779da8b8f3\` FOREIGN KEY (\`userId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_followers\` ADD CONSTRAINT \`FK_c3f56a3157b50bc8adcc6acf278\` FOREIGN KEY (\`followerId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_likes\` ADD CONSTRAINT \`FK_37d337ad54b1aa6b9a44415a498\` FOREIGN KEY (\`userId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_likes\` ADD CONSTRAINT \`FK_6999d13aca25e33515210abaf16\` FOREIGN KEY (\`postId\`) REFERENCES \`post_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category_posts_post_entity\` ADD CONSTRAINT \`FK_8c9c125a5f88531cc63059f8986\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`category_posts_post_entity\` ADD CONSTRAINT \`FK_7b80ef4fbfb55d12ddb367a0c28\` FOREIGN KEY (\`postEntityId\`) REFERENCES \`post_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_entity_tags_tag\` ADD CONSTRAINT \`FK_30d145f2cb22c758e78c4ba74ed\` FOREIGN KEY (\`postEntityId\`) REFERENCES \`post_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`post_entity_tags_tag\` ADD CONSTRAINT \`FK_89178b840f4e5a3e7481f3e58d8\` FOREIGN KEY (\`tagId\`) REFERENCES \`tag\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_entity_followers_user_entity\` ADD CONSTRAINT \`FK_0cfac94a7190e05681bd30031b5\` FOREIGN KEY (\`userEntityId_1\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_entity_followers_user_entity\` ADD CONSTRAINT \`FK_f218c630db489c465aa55e55ae2\` FOREIGN KEY (\`userEntityId_2\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_entity_followers_user_entity\` DROP FOREIGN KEY \`FK_f218c630db489c465aa55e55ae2\``);
        await queryRunner.query(`ALTER TABLE \`user_entity_followers_user_entity\` DROP FOREIGN KEY \`FK_0cfac94a7190e05681bd30031b5\``);
        await queryRunner.query(`ALTER TABLE \`post_entity_tags_tag\` DROP FOREIGN KEY \`FK_89178b840f4e5a3e7481f3e58d8\``);
        await queryRunner.query(`ALTER TABLE \`post_entity_tags_tag\` DROP FOREIGN KEY \`FK_30d145f2cb22c758e78c4ba74ed\``);
        await queryRunner.query(`ALTER TABLE \`category_posts_post_entity\` DROP FOREIGN KEY \`FK_7b80ef4fbfb55d12ddb367a0c28\``);
        await queryRunner.query(`ALTER TABLE \`category_posts_post_entity\` DROP FOREIGN KEY \`FK_8c9c125a5f88531cc63059f8986\``);
        await queryRunner.query(`ALTER TABLE \`post_likes\` DROP FOREIGN KEY \`FK_6999d13aca25e33515210abaf16\``);
        await queryRunner.query(`ALTER TABLE \`post_likes\` DROP FOREIGN KEY \`FK_37d337ad54b1aa6b9a44415a498\``);
        await queryRunner.query(`ALTER TABLE \`user_followers\` DROP FOREIGN KEY \`FK_c3f56a3157b50bc8adcc6acf278\``);
        await queryRunner.query(`ALTER TABLE \`user_followers\` DROP FOREIGN KEY \`FK_347ce7a07457528a1779da8b8f3\``);
        await queryRunner.query(`ALTER TABLE \`post_entity\` DROP FOREIGN KEY \`FK_5e32998d7ac08f573cde04fbfa5\``);
        await queryRunner.query(`ALTER TABLE \`post_to_category\` DROP FOREIGN KEY \`FK_9d072d7c8d7909a5474fee7bbae\``);
        await queryRunner.query(`ALTER TABLE \`post_to_category\` DROP FOREIGN KEY \`FK_9dab22c49ca441a85b5d1305342\``);
        await queryRunner.query(`ALTER TABLE \`tag\` DROP FOREIGN KEY \`FK_d0dc39ff83e384b4a097f47d3f5\``);
        await queryRunner.query(`ALTER TABLE \`post_extra\` DROP FOREIGN KEY \`FK_8ad3325022ede59c17c228d915e\``);
        await queryRunner.query(`DROP INDEX \`idx_follower_uid\` ON \`user_followers\``);
        await queryRunner.query(`DROP INDEX \`uniq_user_follower_id\` ON \`user_followers\``);
        await queryRunner.query(`DROP TABLE \`user_followers\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`post_to_category\``);
        await queryRunner.query(`DROP INDEX \`IDX_6a9775008add570dc3e5a0bab7\` ON \`tag\``);
        await queryRunner.query(`DROP INDEX \`IDX_d0dc39ff83e384b4a097f47d3f\` ON \`tag\``);
        await queryRunner.query(`DROP TABLE \`tag\``);
        await queryRunner.query(`DROP TABLE \`post_extra\``);
    }

}
