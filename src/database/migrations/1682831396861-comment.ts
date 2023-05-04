import { MigrationInterface, QueryRunner } from 'typeorm';

export class Comment1682831396861 implements MigrationInterface {
    name = 'Comment1682831396861';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comments\` ADD \`content\` varchar(255) NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE \`comments\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`comments\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
        );
        await queryRunner.query(`ALTER TABLE \`comments\` ADD \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(
            `ALTER TABLE \`comments\` ADD \`mpath\` varchar(255) NULL DEFAULT ''`,
        );
        await queryRunner.query(`ALTER TABLE \`comments\` ADD \`userId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD \`parentId\` int NULL`);
        await queryRunner.query(
            `CREATE INDEX \`IDX_7e8d7c49f218ebb14314fdb374\` ON \`comments\` (\`userId\`)`,
        );
        await queryRunner.query(
            `ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_7e8d7c49f218ebb14314fdb3749\` FOREIGN KEY (\`userId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_8770bd9030a3d13c5f79a7d2e81\` FOREIGN KEY (\`parentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_8770bd9030a3d13c5f79a7d2e81\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_7e8d7c49f218ebb14314fdb3749\``,
        );
        await queryRunner.query(`DROP INDEX \`IDX_7e8d7c49f218ebb14314fdb374\` ON \`comments\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`parentId\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`mpath\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`content\``);
    }
}
