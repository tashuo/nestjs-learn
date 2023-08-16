import { MigrationInterface, QueryRunner } from 'typeorm';

export class Cascade1692195233247 implements MigrationInterface {
    name = 'Cascade1692195233247';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`admin_role_users\` DROP FOREIGN KEY \`FK_121d35f8fd6e2f2e937fb8fae2f\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_role_users\` DROP FOREIGN KEY \`FK_2cb389e017c5bb513bb40e4488d\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_role_permissions\` DROP FOREIGN KEY \`FK_6187fc585fff9f6c3933a15a536\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_role_permissions\` DROP FOREIGN KEY \`FK_bf21d72d21a52ae169268b15331\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_role_menus\` DROP FOREIGN KEY \`FK_4c5399968f39ced535bc185544b\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_role_menus\` DROP FOREIGN KEY \`FK_8f7b0b8b95c2175d262454175b3\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_role_users\` ADD CONSTRAINT \`FK_121d35f8fd6e2f2e937fb8fae2f\` FOREIGN KEY (\`userId\`) REFERENCES \`admin_users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_role_users\` ADD CONSTRAINT \`FK_2cb389e017c5bb513bb40e4488d\` FOREIGN KEY (\`roleId\`) REFERENCES \`admin_roles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_role_permissions\` ADD CONSTRAINT \`FK_6187fc585fff9f6c3933a15a536\` FOREIGN KEY (\`permissionId\`) REFERENCES \`admin_permissions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_role_permissions\` ADD CONSTRAINT \`FK_bf21d72d21a52ae169268b15331\` FOREIGN KEY (\`roleId\`) REFERENCES \`admin_roles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_role_menus\` ADD CONSTRAINT \`FK_8f7b0b8b95c2175d262454175b3\` FOREIGN KEY (\`menuId\`) REFERENCES \`admin_menus\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_role_menus\` ADD CONSTRAINT \`FK_4c5399968f39ced535bc185544b\` FOREIGN KEY (\`roleId\`) REFERENCES \`admin_roles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`admin_role_menus\` DROP FOREIGN KEY \`FK_4c5399968f39ced535bc185544b\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_role_menus\` DROP FOREIGN KEY \`FK_8f7b0b8b95c2175d262454175b3\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_role_permissions\` DROP FOREIGN KEY \`FK_bf21d72d21a52ae169268b15331\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_role_permissions\` DROP FOREIGN KEY \`FK_6187fc585fff9f6c3933a15a536\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_role_users\` DROP FOREIGN KEY \`FK_2cb389e017c5bb513bb40e4488d\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_role_users\` DROP FOREIGN KEY \`FK_121d35f8fd6e2f2e937fb8fae2f\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_role_menus\` ADD CONSTRAINT \`FK_8f7b0b8b95c2175d262454175b3\` FOREIGN KEY (\`menuId\`) REFERENCES \`admin_menus\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_role_menus\` ADD CONSTRAINT \`FK_4c5399968f39ced535bc185544b\` FOREIGN KEY (\`roleId\`) REFERENCES \`admin_roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_role_permissions\` ADD CONSTRAINT \`FK_bf21d72d21a52ae169268b15331\` FOREIGN KEY (\`roleId\`) REFERENCES \`admin_roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_role_permissions\` ADD CONSTRAINT \`FK_6187fc585fff9f6c3933a15a536\` FOREIGN KEY (\`permissionId\`) REFERENCES \`admin_permissions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_role_users\` ADD CONSTRAINT \`FK_2cb389e017c5bb513bb40e4488d\` FOREIGN KEY (\`roleId\`) REFERENCES \`admin_roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`admin_role_users\` ADD CONSTRAINT \`FK_121d35f8fd6e2f2e937fb8fae2f\` FOREIGN KEY (\`userId\`) REFERENCES \`admin_users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
