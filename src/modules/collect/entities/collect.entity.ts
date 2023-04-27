import { Exclude, Expose, Type } from 'class-transformer';
import { UserEntity } from '../../user/entities/user.entity';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    ManyToMany,
    ManyToOne,
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

    @Expose()
    @ManyToMany((type) => PostEntity, (post) => post.collects)
    posts: PostEntity[];

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
