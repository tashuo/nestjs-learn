import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

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

    @Column()
    user_id: number;

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
}
