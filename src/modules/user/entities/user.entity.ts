import { PostEntity } from '../../post/entities/post.entity';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
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
export class UserEntity extends BaseEntity {
    [key: string]: any;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
    })
    username: string;

    @Column()
    nickname: string;

    @Column()
    avatar: string;

    @Exclude()
    @Column()
    password: string;

    @Exclude()
    @CreateDateColumn()
    created_at: Date;

    @Exclude()
    @UpdateDateColumn()
    updated_at: Date;

    @Exclude()
    @DeleteDateColumn()
    deleted_at?: Date;

    @OneToMany(() => PostEntity, (post) => post.user)
    posts!: PostEntity[];

    @OneToMany(() => Tag, (tag) => tag.user)
    tags!: Tag[];

    // 第一种做法，直接ManyToMany，使用没问题
    @ManyToMany(() => UserEntity, (user) => user.following)
    @JoinTable()
    followers: UserEntity[];

    @ManyToMany(() => UserEntity, (user) => user.followers)
    following: UserEntity[];

    // 第二种做法，自定义entity，有问题
    @OneToMany(() => UserFollowerEntity, (follow) => follow.follower)
    followers_2: UserEntity[];

    @OneToMany(() => UserFollowerEntity, (follow) => follow.user)
    following_2: UserEntity[];
}
