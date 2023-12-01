import { BaseEntity } from '../../../common/base/base.entity';
import { AfterLoad, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AdminUserEntity } from './user.entity';
import { AdminPermissionEntity } from './permission.entity';
import { AdminMenuEntity } from './menu.entity';
import { Exclude } from 'class-transformer';

@Entity('admin_roles')
export class AdminRoleEntity extends BaseEntity {
    [key: string]: any;

    @Column({
        comment: '名称',
    })
    name: string;

    @Column({
        comment: '唯一标识',
        unique: true,
    })
    slug: string;

    @Exclude()
    @OneToMany(() => AdminRoleUsersEntity, (users) => users.role)
    users: AdminRoleUsersEntity[];

    @Exclude()
    @OneToMany(() => AdminRolePermissionsEntity, (permissions) => permissions.role)
    permissions: AdminRolePermissionsEntity[];

    @Exclude()
    @OneToMany(() => AdminRoleMenusEntity, (menus) => menus.role)
    menus: AdminRoleMenusEntity[];

    menu_list: AdminMenuEntity[];

    permission_list: AdminPermissionEntity[];

    @AfterLoad()
    format () {
        this.menu_list = this.menus.map(v => v.menu)
        this.permission_list = this.permissions.map(v => v.permission)
    }
}

@Entity('admin_role_users')
export class AdminRoleUsersEntity extends BaseEntity {
    @ManyToOne(() => AdminUserEntity, (user) => user.roles, {
        onDelete: 'CASCADE',
    })
    user: AdminUserEntity;

    @ManyToOne(() => AdminRoleEntity, (role) => role.users, {
        onDelete: 'CASCADE',
    })
    role: AdminRoleEntity;
}

@Entity('admin_role_permissions')
export class AdminRolePermissionsEntity extends BaseEntity {
    @ManyToOne(() => AdminPermissionEntity, (permission) => permission.roles, {
        onDelete: 'CASCADE',
    })
    permission: AdminPermissionEntity;

    @ManyToOne(() => AdminRoleEntity, (role) => role.permissions, {
        onDelete: 'CASCADE',
    })
    role: AdminRoleEntity;
}

@Entity('admin_role_menus')
export class AdminRoleMenusEntity extends BaseEntity {
    @ManyToOne(() => AdminMenuEntity, (menu) => menu.roles, {
        onDelete: 'CASCADE',
    })
    menu: AdminMenuEntity;

    @ManyToOne(() => AdminRoleEntity, (role) => role.menus, {
        onDelete: 'CASCADE',
    })
    role: AdminRoleEntity;
}
