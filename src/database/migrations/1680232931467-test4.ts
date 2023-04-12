import { MigrationInterface, QueryRunner } from 'typeorm';

export class test41680232931467 implements MigrationInterface {
    name = 'test41680232931467';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`text\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`category_posts_post\` (\`categoryId\` int NOT NULL, \`postId\` int NOT NULL, INDEX \`IDX_3a1f3735235af2f4b702a3d398\` (\`categoryId\`), INDEX \`IDX_0cb77d79c53f0759b8153ec8a6\` (\`postId\`), PRIMARY KEY (\`categoryId\`, \`postId\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`category_posts_post\` ADD CONSTRAINT \`FK_3a1f3735235af2f4b702a3d3987\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`category_posts_post\` ADD CONSTRAINT \`FK_0cb77d79c53f0759b8153ec8a62\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`category_posts_post\` DROP FOREIGN KEY \`FK_0cb77d79c53f0759b8153ec8a62\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`category_posts_post\` DROP FOREIGN KEY \`FK_3a1f3735235af2f4b702a3d3987\``,
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_0cb77d79c53f0759b8153ec8a6\` ON \`category_posts_post\``,
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_3a1f3735235af2f4b702a3d398\` ON \`category_posts_post\``,
        );
        await queryRunner.query(`DROP TABLE \`category_posts_post\``);
        await queryRunner.query(`DROP TABLE \`category\``);
    }
}
