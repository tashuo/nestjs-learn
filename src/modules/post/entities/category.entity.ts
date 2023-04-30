import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
    DeleteDateColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';
import { PostToCategory } from './postToCategory.entity';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    text: string;

    @ManyToMany(() => PostEntity, (post) => post.categories)
    @JoinTable()
    posts: PostEntity[];

    @OneToMany(() => PostToCategory, (postToCategory) => postToCategory.category)
    public postToCategories: PostToCategory[];

    @DeleteDateColumn()
    deleted_at?: Date;
}
