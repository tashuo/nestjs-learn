import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../common/base/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AdminRolePermissionsEntity } from './role.entity';

@Entity('admin_permissions')
export class AdminPermissionEntity extends BaseEntity {
    @Column({
        comment: '名称',
    })
    name: string;

    @Column({
        comment: '唯一标识',
        unique: true,
    })
    slug: string;

    @Column({
        comment: 'http方法',
    })
    http_method: string;

    @Column({
        comment: 'http路径',
        length: 10000,
    })
    http_path: string;

    @Column({
        comment: '权重',
        default: 0,
    })
    weight: number;

    @ManyToOne(() => AdminPermissionEntity, (parent) => parent.children)
    parent: AdminPermissionEntity;

    @OneToMany(() => AdminPermissionEntity, (children) => children.parent)
    children: AdminPermissionEntity;

    @Exclude()
    @OneToMany(() => AdminRolePermissionsEntity, (roles) => roles.permission, {
        cascade: true,
    })
    roles: AdminRolePermissionsEntity[];
}
