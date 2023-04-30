import { Injectable } from '@nestjs/common';
import { CollectEntity, CollectPostEntity } from './entities/collect.entity';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class CollectService {
    async create(user: UserEntity, title: string) {
        const collect = await CollectEntity.createQueryBuilder()
            .insert()
            .updateEntity(false)
            .values({
                title,
                user,
            })
            .execute();
        return await CollectEntity.findOneBy({ id: collect.raw.insertId });
    }

    async list(user: UserEntity, page = 1, limit = 10) {
        return CollectEntity.createQueryBuilder()
            .where('userId = userId', { userId: user.id })
            .orderBy('id', 'DESC')
            .offset((page - 1) * limit)
            .limit(limit)
            .getMany();
    }

    async getPosts(collect: CollectEntity, page = 1, limit = 10) {
        return CollectPostEntity.createQueryBuilder(CollectPostEntity.name)
            .leftJoinAndSelect(`${CollectPostEntity.name}.post`, 'post')
            .where('collectId = :collectId', { collectId: collect.id })
            .select([
                'post.*',
                `${CollectPostEntity.name}.remark`,
                `${CollectPostEntity.name}.createdAt`,
            ])
            .orderBy(`${CollectPostEntity.name}.id`, 'DESC')
            .offset((page - 1) * limit)
            .limit(limit)
            .getMany();
    }

    async delete(collect: CollectEntity) {
        collect.remove();
    }
}
