import { Exclude, Expose } from 'class-transformer';
import { BaseEntity } from '../../../common/base/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AdminRoleMenusEntity } from './role.entity';

@Exclude()
@Entity('admin_menus')
export class AdminMenuEntity extends BaseEntity {
    @Expose()
    @Column({
        comment: '名称',
    })
    name: string;

    @Expose()
    @Column({
        comment: 'uri',
    })
    uri: string;

    @Expose()
    @Column({
        comment: 'icon',
    })
    icon: string;

    @Column({
        comment: '是否展示',
        default: false,
    })
    show: boolean;

    @Column({
        comment: '权重',
        default: 0,
    })
    weight: number;

    @Expose()
    @ManyToOne(() => AdminMenuEntity, (parent) => parent.children)
    parent: AdminMenuEntity;

    @OneToMany(() => AdminMenuEntity, (children) => children.parent)
    children: AdminMenuEntity;

    @OneToMany(() => AdminRoleMenusEntity, (roles) => roles.menu, {
        cascade: true,
    })
    roles: AdminRoleMenusEntity[];
}
