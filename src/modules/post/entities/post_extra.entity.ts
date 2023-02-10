import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Post as PostEntity } from './post.entity';

@Entity('post_extra')
export class PostExtra extends BaseEntity {
    @PrimaryColumn()
    post_id: number;
    @OneToOne(() => PostEntity, (post) => post.extra, {
        cascade: true,
    })
    @JoinColumn({ name: 'post_id' })
    post: PostEntity;

    @Column()
    like_counts: number;

    @Column()
    comment_counts: number;
}
