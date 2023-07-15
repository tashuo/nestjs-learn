import { UserEntity } from '../../user/entities/user.entity';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { PostExtraEntity } from './post_extra.entity';
import { Tag as TagEntity } from '../../tag/entities/tag.entity';
import { Exclude, Expose, Type } from 'class-transformer';
import { Category } from './category.entity';
import { PostToCategory } from './postToCategory.entity';

export enum ContentType {
    HTML = 'html',
    MARKDOWN = 'markdown',
    TEXT = 'text',
}

export enum STATUS {
    NORMAL = 'normal',
    DELETE = 'delete',
}

@Entity()
export class PostEntity extends BaseEntity {
    [key: string]: any;

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.posts, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @Index()
    user: UserEntity;

    @Column()
    title: string;

    @Column()
    content: string;

    /**
     * 文章类型
     * @example text
     */
    @Column({
        type: 'enum',
        enum: ContentType,
        default: ContentType.TEXT,
    })
    content_type: ContentType;

    @Exclude()
    @Column({
        type: 'enum',
        enum: STATUS,
        default: STATUS.NORMAL,
    })
    status: STATUS;

    @Type(() => Number)
    @Column({ comment: '评论数' })
    @Index()
    comment_count: number;

    @Type(() => Number)
    @Column({ comment: '点赞数' })
    @Index()
    like_count: number;

    @Type(() => Number)
    @Column({ comment: '转发数' })
    repost_count: number;

    @Type(() => Number)
    @Column({ comment: '收藏数' })
    collect_count: number;

    @Type(() => Number)
    @Column({ comment: '详情页浏览数' })
    @Index()
    detail_count: number;

    @CreateDateColumn()
    created_at: Date;

    @Exclude()
    @UpdateDateColumn()
    updated_at: Date;

    @Exclude()
    @DeleteDateColumn()
    deleted_at?: Date;

    @ManyToMany(() => TagEntity)
    @JoinTable()
    tags?: TagEntity[];

    @OneToOne(() => PostExtraEntity, (extra) => extra.post)
    extra: PostExtraEntity;

    @ManyToMany(() => Category, (category) => category.posts)
    categories: Category[];

    @OneToMany(() => PostToCategory, (postToCategory) => postToCategory.post)
    postToCategories: PostToCategory[];
}

export class PostInfo extends PostEntity {
    isLiked = false;

    constructor(data: Partial<PostInfo>) {
        super();
        Object.assign(this, data);
    }
}
