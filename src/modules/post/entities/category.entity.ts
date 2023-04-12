import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Post } from './post.entity';
import { PostToCategory } from './postToCategory.entity';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    text: string;

    @ManyToMany(() => Post, (post) => post.categories)
    @JoinTable()
    posts: Post[];

    @OneToMany(() => PostToCategory, (postToCategory) => postToCategory.category)
    public postToCategories: PostToCategory[];
}
