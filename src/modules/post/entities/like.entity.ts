import { Expose, Type } from 'class-transformer';
import { UserEntity } from '../../user/entities/user.entity';
import {
    BaseEntity,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';
import { CommentEntity } from 'src/modules/comment/entities/comment.entity';

class LikeEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Expose()
    @Type(() => Date)
    @CreateDateColumn({
        comment: '创建时间',
    })
    createdAt: Date;
}

@Entity('post_likes')
@Index('uniq_user_post', ['user', 'post'], { unique: true })
export class PostLikeEntity extends LikeEntity {
    @Expose()
    @ManyToOne((type) => UserEntity, (user) => user.post_likes)
    user: UserEntity;

    @Expose()
    @ManyToOne((type) => PostEntity, (post) => post.post_likes)
    post: PostEntity;
}

// @Entity('comment_likes')
// @Index('uniq_user_comment', ['comment', 'user'], { unique: true })
// export class CommentLikeEntity extends LikeEntity {
//     @Expose()
//     @ManyToOne((type) => UserEntity, (user) => user.comment_likes)
//     user: UserEntity;

//     @Expose()
//     @ManyToOne((type) => CommentEntity, (comment) => comment.comment_likes)
//     comment: CommentEntity;
// }
