import { Post } from '../../post/entities/post.entity';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Tag } from '../../tag/entities/tag.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
    })
    username: string;

    @Column()
    nickname: string;

    @Exclude()
    @Column({
        type: 'char',
        length: 32,
    })
    password: string;

    @Exclude()
    @CreateDateColumn()
    created_at: Date;

    @Exclude()
    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Post, (post) => post.user)
    posts!: Post[];

    @OneToMany(() => Tag, (tag) => tag.user)
    tags!: Tag[];
}
