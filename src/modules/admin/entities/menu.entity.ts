import { Exclude, Expose } from 'class-transformer';
import { BaseEntity } from '../../../common/base/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AdminRoleMenusEntity } from './role.entity';

@Entity('admin_menus')
export class AdminMenuEntity extends BaseEntity {
    @Column({
        comment: '名称',
    })
    name: string;

    @Column({
        comment: 'path',
    })
    path: string;

    @Column({
        comment: 'icon',
    })
    icon: string;

    @Column({
        comment: '权重',
        default: 0,
    })
    weight: number;

    @ManyToOne(() => AdminMenuEntity, (parent) => parent.children)
    parent: AdminMenuEntity;

    @OneToMany(() => AdminMenuEntity, (children) => children.parent)
    children: AdminMenuEntity;

    @Exclude()
    @OneToMany(() => AdminRoleMenusEntity, (roles) => roles.menu, {
        cascade: true,
    })
    roles: AdminRoleMenusEntity[];
}
