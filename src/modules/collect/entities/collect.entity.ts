import { Exclude, Expose, Type } from 'class-transformer';
import { UserEntity } from '../../user/entities/user.entity';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { PostEntity } from '../../post/entities/post.entity';

/**
 * 收藏夹模型
 */
@Exclude()
@Entity('collects')
export class CollectEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn()
    id: number;

    @Expose()
    @ManyToOne(() => UserEntity, (user) => user.collects, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @Index('idx_uid')
    user: UserEntity;

    @OneToMany(() => CollectPostEntity, (collectPost) => collectPost.collect)
    posts: CollectPostEntity[];

    @Expose()
    @Column({ comment: '收藏夹名称' })
    @Index({ fulltext: true })
    title: string;

    @Expose()
    @Type(() => Date)
    @CreateDateColumn({
        comment: '创建时间',
    })
    createdAt: Date;

    @Expose()
    @Type(() => Date)
    @UpdateDateColumn({
        comment: '更新时间',
    })
    updatedAt: Date;

    @Expose()
    @Type(() => Date)
    @DeleteDateColumn({
        comment: '删除时间',
    })
    deletedAt: Date;
}

@Entity('collect_posts')
@Index('uniq_collect_post', ['collect', 'post'], { unique: true })
export class CollectPostEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Expose()
    @ManyToOne(() => CollectEntity, (collect) => collect.posts)
    collect: CollectEntity;

    @Expose()
    @ManyToOne(() => PostEntity, (post) => post.collects)
    post: PostEntity;

    @Column({ comment: '备注' })
    remark: string;

    @Expose()
    @Type(() => Date)
    @CreateDateColumn({
        comment: '创建时间',
    })
    createdAt: Date;
}
