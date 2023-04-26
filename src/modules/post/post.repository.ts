import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostRepository extends Repository<PostEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(PostEntity, dataSource.createEntityManager());
    }
}
