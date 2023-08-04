import { Exclude, Expose, Type } from 'class-transformer';
import { PostEntity } from '../../post/entities/post.entity';
import { UserEntity } from '../../user/entities/user.entity';
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
    Tree,
    TreeChildren,
    TreeParent,
    UpdateDateColumn,
} from 'typeorm';
import { convertToFriendlyTime } from '../../../utils/helper';
import { CommentLikeEntity } from './like.entity';

class InteractionInfo {
    liked = false;
    like_count = 0;
    reply_count = 0;
}

@Entity('comments')
@Tree('materialized-path')
@Index('idx_mpath', ['mpath'])
export class CommentEntity extends BaseEntity {
    [key: string]: any;

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PostEntity, (post) => post.comments, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @Index()
    post: PostEntity;

    @ManyToOne(() => UserEntity, (user) => user.comments, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @Index()
    user: UserEntity;

    @Column()
    content: string;

    @CreateDateColumn()
    created_at: Date;

    created_at_friendly: string;

    @Exclude()
    @UpdateDateColumn()
    updated_at: Date;

    @Exclude()
    @DeleteDateColumn()
    deleted_at: Date;

    @TreeChildren()
    children: CommentEntity[];

    @TreeParent()
    parent: CommentEntity;

    @Exclude()
    @Type(() => Number)
    @Column({ comment: '点赞数', default: 0 })
    @Index()
    like_count: number;

    @Exclude()
    comment_likes: CommentLikeEntity[];

    @Exclude()
    @Type(() => Number)
    @Column({ comment: '回复数量，只有根节点存储该值', default: 0 })
    @Index()
    reply_count: number;

    mpath?: string;

    interaction_info: InteractionInfo;

    @AfterLoad()
    formatDateAndUrl() {
        this.created_at_friendly = convertToFriendlyTime(this.created_at);
    }
}
