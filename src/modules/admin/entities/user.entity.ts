import { BaseWithDeletedEntity } from '../../../common/base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { AdminRoleUsersEntity } from './role.entity';
import { Exclude } from 'class-transformer';
import { AdminMenuEntity } from './menu.entity';

@Entity('admin_users')
export class AdminUserEntity extends BaseWithDeletedEntity {
    @Column({
        unique: true,
        comment: '用户名',
    })
    username: string;

    @Column({
        comment: '昵称',
        default: '',
    })
    nickname: string;

    @Exclude()
    @Column({
        comment: '密码',
    })
    password: string;

    @Exclude()
    @OneToMany(() => AdminRoleUsersEntity, (roles) => roles.user)
    roles: AdminRoleUsersEntity[];

    menus: AdminMenuEntity[];
}
