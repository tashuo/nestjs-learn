import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comments')
export class CommentEntity extends BaseEntity {
    [key: string]: any;

    @PrimaryGeneratedColumn()
    id: number;
}
