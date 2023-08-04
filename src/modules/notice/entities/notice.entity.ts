import { Exclude } from 'class-transformer';
import {
    AfterLoad,
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { NoticeTypes } from '../types';
import { UserEntity } from '../../user/entities/user.entity';
import { PostEntity } from '../../post/entities/post.entity';
import { CommentEntity } from '../../comment/entities/comment.entity';
import { convertToFriendlyTime } from '../../../utils/helper';

@Entity('notices')
@Index('idx_user_type_created', ['user', 'type', 'created_at'])
export class NoticeEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity)
    user: UserEntity;

    @ManyToOne(() => UserEntity)
    operator?: UserEntity;

    @Column({ comment: '类型', type: 'enum', enum: NoticeTypes })
    type: NoticeTypes;

    @ManyToOne(() => PostEntity)
    post?: PostEntity;

    @ManyToOne(() => CommentEntity)
    comment?: CommentEntity;

    @Column({ comment: '内容', length: 1000, default: '' })
    content?: string;

    @Exclude()
    @Column({ comment: '是否已读' })
    is_read: boolean;

    @Exclude()
    @CreateDateColumn({ comment: '创建日期' })
    created_at: Date;

    @Exclude()
    @DeleteDateColumn()
    deleted_at?: Date;

    created_at_friendly: string;

    @AfterLoad()
    formatDateAndUrl() {
        this.created_at_friendly = convertToFriendlyTime(this.created_at);
    }
}
