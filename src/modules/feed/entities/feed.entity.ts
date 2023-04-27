import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 关注feed流
 */
@Exclude()
@Entity('feeds')
@Index('uniq_user_post', ['user_id', 'post_id'], { unique: true })
@Index('idx_author_user', ['author_id', 'user_id'])
@Index('idx_publish_time_user', ['publish_time', 'user_id'])
export class FeedEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        comment: '帖子ID',
        type: String,
    })
    post_id: string;

    @Column({
        comment: '楼主ID',
        type: String,
    })
    author_id: string;

    @Column({
        comment: '用户ID',
        type: String,
    })
    user_id: string;

    @Column({
        comment: '发布时间戳',
        type: Number,
        unsigned: true,
    })
    publish_time: number;
}
