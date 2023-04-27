import { Injectable } from '@nestjs/common';
import { CollectEntity } from './entities/collect.entity';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class CollectService {
    async create(user: UserEntity, title: string) {
        console.log('create');
    }

    async list(user: UserEntity) {
        console.log('list');
    }

    async getPosts(id: number) {
        console.log('getPost');
    }

    async delete(id: number) {
        CollectEntity.delete(id);
    }
}
