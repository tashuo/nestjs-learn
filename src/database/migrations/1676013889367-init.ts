import { MigrationInterface, QueryRunner } from "typeorm";

export class init1676013889367 implements MigrationInterface {
    name = 'init1676013889367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`nickname\` varchar(255) NOT NULL, \`password\` char(32) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`post_extra\` (\`post_id\` int NOT NULL, \`like_counts\` int NOT NULL, \`comment_counts\` int NOT NULL, UNIQUE INDEX \`REL_8ad3325022ede59c17c228d915\` (\`post_id\`), PRIMARY KEY (\`post_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tag\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`content_type\` enum ('html', 'markdown', 'text') NOT NULL DEFAULT 'text', \`status\` enum ('normal', 'delete') NOT NULL DEFAULT 'normal', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`post_tags_tag\` (\`postId\` int NOT NULL, \`tagId\` int NOT NULL, INDEX \`IDX_b651178cc41334544a7a9601c4\` (\`postId\`), INDEX \`IDX_41e7626b9cc03c5c65812ae55e\` (\`tagId\`), PRIMARY KEY (\`postId\`, \`tagId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`post_extra\` ADD CONSTRAINT \`FK_8ad3325022ede59c17c228d915e\` FOREIGN KEY (\`post_id\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_5c1cf55c308037b5aca1038a131\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`post_tags_tag\` ADD CONSTRAINT \`FK_b651178cc41334544a7a9601c45\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`post_tags_tag\` ADD CONSTRAINT \`FK_41e7626b9cc03c5c65812ae55e8\` FOREIGN KEY (\`tagId\`) REFERENCES \`tag\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post_tags_tag\` DROP FOREIGN KEY \`FK_41e7626b9cc03c5c65812ae55e8\``);
        await queryRunner.query(`ALTER TABLE \`post_tags_tag\` DROP FOREIGN KEY \`FK_b651178cc41334544a7a9601c45\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_5c1cf55c308037b5aca1038a131\``);
        await queryRunner.query(`ALTER TABLE \`post_extra\` DROP FOREIGN KEY \`FK_8ad3325022ede59c17c228d915e\``);
        await queryRunner.query(`DROP INDEX \`IDX_41e7626b9cc03c5c65812ae55e\` ON \`post_tags_tag\``);
        await queryRunner.query(`DROP INDEX \`IDX_b651178cc41334544a7a9601c4\` ON \`post_tags_tag\``);
        await queryRunner.query(`DROP TABLE \`post_tags_tag\``);
        await queryRunner.query(`DROP TABLE \`post\``);
        await queryRunner.query(`DROP TABLE \`tag\``);
        await queryRunner.query(`DROP INDEX \`REL_8ad3325022ede59c17c228d915\` ON \`post_extra\``);
        await queryRunner.query(`DROP TABLE \`post_extra\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
