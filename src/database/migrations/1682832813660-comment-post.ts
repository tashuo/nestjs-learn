import { MigrationInterface, QueryRunner } from 'typeorm';

export class CommentPost1682832813660 implements MigrationInterface {
    name = 'CommentPost1682832813660';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comments\` ADD \`postId\` int NOT NULL`);
        await queryRunner.query(
            `CREATE INDEX \`IDX_e44ddaaa6d058cb4092f83ad61\` ON \`comments\` (\`postId\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_e44ddaaa6d058cb4092f83ad61f\` FOREIGN KEY (\`postId\`) REFERENCES \`post_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_e44ddaaa6d058cb4092f83ad61f\``,
        );
        await queryRunner.query(`DROP INDEX \`IDX_e44ddaaa6d058cb4092f83ad61\` ON \`comments\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`postId\``);
    }
}
