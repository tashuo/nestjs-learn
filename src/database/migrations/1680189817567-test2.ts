import { MigrationInterface, QueryRunner } from 'typeorm';

export class test21680189817567 implements MigrationInterface {
    name = 'test21680189817567';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`user_followers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`create_time\` int UNSIGNED NOT NULL COMMENT '关注时间戳', \`userId\` int NULL, \`followerId\` int NULL, UNIQUE INDEX \`uniq_user_follower_id\` (\`userId\`, \`followerId\`), INDEX \`idx_follower_uid\` (\`followerId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_followers\` ADD CONSTRAINT \`FK_347ce7a07457528a1779da8b8f3\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_followers\` ADD CONSTRAINT \`FK_c3f56a3157b50bc8adcc6acf278\` FOREIGN KEY (\`followerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`user_followers\` DROP FOREIGN KEY \`FK_c3f56a3157b50bc8adcc6acf278\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_followers\` DROP FOREIGN KEY \`FK_347ce7a07457528a1779da8b8f3\``,
        );
        await queryRunner.query(`DROP INDEX \`idx_follower_uid\` ON \`user_followers\``);
        await queryRunner.query(`DROP INDEX \`uniq_user_follower_id\` ON \`user_followers\``);
        await queryRunner.query(`DROP TABLE \`user_followers\``);
    }
}
