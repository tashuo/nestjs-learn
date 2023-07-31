import { MigrationInterface, QueryRunner } from 'typeorm';

export class CommentReplyCount1690474460625 implements MigrationInterface {
    name = 'CommentReplyCount1690474460625';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`comments\` ADD \`reply_count\` int NOT NULL COMMENT '回复数量，只有根节点存储该值' DEFAULT '0'`,
        );
        await queryRunner.query(
            `CREATE INDEX \`IDX_02a459982cd42bf377068322b3\` ON \`comments\` (\`reply_count\`)`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_02a459982cd42bf377068322b3\` ON \`comments\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`reply_count\``);
    }
}
