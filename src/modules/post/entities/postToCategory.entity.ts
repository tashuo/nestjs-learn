import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';
import { PostEntity } from './post.entity';

@Entity()
export class PostToCategory {
    @PrimaryGeneratedColumn()
    public postToCategoryId: number;

    @Column()
    public postId: number;

    @Column()
    public categoryId: number;

    @Column()
    public order: number;

    @ManyToOne(() => PostEntity, (post) => post.postToCategories)
    public post: PostEntity;

    @ManyToOne(() => Category, (category) => category.postToCategories)
    public category: Category;
}
