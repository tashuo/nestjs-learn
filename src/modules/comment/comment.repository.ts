import { Injectable } from '@nestjs/common';
import { DataSource, TreeRepository } from 'typeorm';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentRepository extends TreeRepository<CommentEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(CommentEntity, dataSource.createEntityManager());
    }
}
