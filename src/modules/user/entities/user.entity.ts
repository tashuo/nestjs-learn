import { Post } from '../../post/entities/post.entity';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Tag } from '../../tag/entities/tag.entity';
import { Exclude } from 'class-transformer';
import { UserFollowerEntity } from './follow.entity';

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

    // 第一种做法，直接ManyToMany，使用没问题
    // @ManyToMany(() => User, (user) => user.following)
    // @JoinTable()
    // followers: User[];

    // @ManyToMany(() => User, (user) => user.followers)
    // following: User[];

    // 第二种做法，自定义entity，有问题
    @OneToMany(() => UserFollowerEntity, (follow) => follow.follower)
    followers: UserFollowerEntity[];

    @OneToMany(() => UserFollowerEntity, (follow) => follow.user)
    following: UserFollowerEntity[];
}
