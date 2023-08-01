import { MigrationInterface, QueryRunner } from 'typeorm';

export class Notice1690820190791 implements MigrationInterface {
    name = 'Notice1690820190791';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`notices\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('follow', 'like', 'collect', 'comment') NOT NULL COMMENT '类型', \`content\` varchar(1000) NOT NULL COMMENT '内容', \`is_read\` tinyint NOT NULL COMMENT '是否已读', \`created_at\` datetime(6) NOT NULL COMMENT '创建日期' DEFAULT CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`userId\` int NULL, \`operatorId\` int NULL, \`postId\` int NULL, \`commentId\` int NULL, INDEX \`idx_user_type_created\` (\`userId\`, \`type\`, \`created_at\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
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
        await queryRunner.query(`DROP INDEX \`idx_user_type_created\` ON \`notices\``);
        await queryRunner.query(`DROP TABLE \`notices\``);
    }
}
