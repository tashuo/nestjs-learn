import { Expose } from 'class-transformer';
import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

@Entity('user_followers')
@Index('idx_follower_uid', ['follower'])
@Index('uniq_user_follower_id', ['user', 'follower'], { unique: true })
export class UserFollowerEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Expose()
    @ManyToOne(() => User, (user) => user.following)
    user: User;

    @Expose()
    @ManyToOne(() => User, (user) => user.followers_2)
    follower: User;

    @Column({
        comment: '关注时间戳',
        type: Number,
        unsigned: true,
    })
    create_time: number;
}
