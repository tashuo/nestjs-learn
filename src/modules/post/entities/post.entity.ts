import { User } from '../../user/entities/user.entity';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
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
import { PostExtra } from './post_extra.entity';
import { Tag as TagEntity } from '../../tag/entities/tag.entity';
import { Exclude, Expose } from 'class-transformer';
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
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Expose()
    @ManyToOne(() => User, (user) => user.posts, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @Index()
    user: User;

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

    @CreateDateColumn()
    created_at: Date;

    @Exclude()
    @UpdateDateColumn()
    updated_at: Date;

    @ManyToMany(() => TagEntity)
    @JoinTable()
    tags?: TagEntity[];

    @OneToOne(() => PostExtra, (extra) => extra.post)
    extra: PostExtra;

    @ManyToMany(() => Category, (category) => category.posts)
    categories: Category[];

    @OneToMany(() => PostToCategory, (postToCategory) => postToCategory.post)
    postToCategories: PostToCategory[];
}
