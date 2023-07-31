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
import { CommentEntity } from './comment.entity';

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

@Entity('comment_likes')
@Index('uniq_user_comment', ['user', 'comment'], { unique: true })
export class CommentLikeEntity extends LikeEntity {
    @Expose()
    @ManyToOne(() => UserEntity, (user) => user.comment_likes)
    user: UserEntity;

    @Expose()
    @ManyToOne(() => CommentEntity, (comment) => comment.comment_likes)
    comment: CommentEntity;
}
