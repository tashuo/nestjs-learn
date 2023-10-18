import { Injectable } from '@nestjs/common';
import { DataSource, TreeRepository } from 'typeorm';
import { AdminMenuEntity } from '../entities';

@Injectable()
export class MenuRepository extends TreeRepository<AdminMenuEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(AdminMenuEntity, dataSource.createEntityManager());
    }
}
