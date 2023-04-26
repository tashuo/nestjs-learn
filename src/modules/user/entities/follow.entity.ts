import { Expose } from 'class-transformer';
import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from './user.entity';

@Entity('user_followers')
@Index('idx_follower_uid', ['follower'])
@Index('uniq_user_follower_id', ['user', 'follower'], { unique: true })
export class UserFollowerEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Expose()
    @ManyToOne(() => UserEntity, (user) => user.following)
    user: UserEntity;

    @Expose()
    @ManyToOne(() => UserEntity, (user) => user.followers_2)
    follower: UserEntity;

    @Column({
        comment: '关注时间戳',
        type: Number,
        unsigned: true,
    })
    create_time: number;
}
