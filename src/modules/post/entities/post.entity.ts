import { User } from '../../user/entities/user.entity';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { PostExtra } from './post_extra.entity';
import { Tag as TagEntity } from './tag.entity';

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

    @ManyToOne(() => User, (user) => user.posts, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    user: User;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column({
        type: 'enum',
        enum: ContentType,
        default: ContentType.TEXT,
    })
    content_type: ContentType;

    @Column({
        type: 'enum',
        enum: STATUS,
        default: STATUS.NORMAL,
    })
    status: STATUS;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToMany(() => TagEntity)
    @JoinTable()
    tags?: TagEntity[];

    @OneToOne(() => PostExtra, (extra) => extra.post)
    extra: PostExtra;
}
