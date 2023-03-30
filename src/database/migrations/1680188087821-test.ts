import { MigrationInterface, QueryRunner } from 'typeorm';

export class test1680188087821 implements MigrationInterface {
    name = 'test1680188087821';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`user_followers_user\` (\`userId_1\` int NOT NULL, \`userId_2\` int NOT NULL, INDEX \`IDX_26312a1e34901011fc6f63545e\` (\`userId_1\`), INDEX \`IDX_110f993e5e9213a7a44f172b26\` (\`userId_2\`), PRIMARY KEY (\`userId_1\`, \`userId_2\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_followers_user\` ADD CONSTRAINT \`FK_26312a1e34901011fc6f63545e2\` FOREIGN KEY (\`userId_1\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_followers_user\` ADD CONSTRAINT \`FK_110f993e5e9213a7a44f172b264\` FOREIGN KEY (\`userId_2\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`user_followers_user\` DROP FOREIGN KEY \`FK_110f993e5e9213a7a44f172b264\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`user_followers_user\` DROP FOREIGN KEY \`FK_26312a1e34901011fc6f63545e2\``,
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_110f993e5e9213a7a44f172b26\` ON \`user_followers_user\``,
        );
        await queryRunner.query(
            `DROP INDEX \`IDX_26312a1e34901011fc6f63545e\` ON \`user_followers_user\``,
        );
        await queryRunner.query(`DROP TABLE \`user_followers_user\``);
    }
}
