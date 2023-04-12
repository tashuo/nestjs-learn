import { MigrationInterface, QueryRunner } from 'typeorm';

export class test51680233276858 implements MigrationInterface {
    name = 'test51680233276858';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`post_to_category\` (\`postToCategoryId\` int NOT NULL AUTO_INCREMENT, \`postId\` int NOT NULL, \`categoryId\` int NOT NULL, \`order\` int NOT NULL, PRIMARY KEY (\`postToCategoryId\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_to_category\` ADD CONSTRAINT \`FK_9dab22c49ca441a85b5d1305342\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_to_category\` ADD CONSTRAINT \`FK_9d072d7c8d7909a5474fee7bbae\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`post_to_category\` DROP FOREIGN KEY \`FK_9d072d7c8d7909a5474fee7bbae\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`post_to_category\` DROP FOREIGN KEY \`FK_9dab22c49ca441a85b5d1305342\``,
        );
        await queryRunner.query(`DROP TABLE \`post_to_category\``);
    }
}
