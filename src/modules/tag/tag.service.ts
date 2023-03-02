import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { TagRepository } from './tag.repository';
import { isNil } from 'lodash';

@Injectable()
export class TagService {
    constructor(private readonly tagRepository: TagRepository) {}
    async create(createTagDto: CreateTagDto, user: User) {
        const ret = await this.tagRepository
            .createQueryBuilder()
            .insert()
            .into(Tag)
            .values({
                ...createTagDto,
                user: user,
            } as any)
            .orIgnore()
            .execute();
        // console.log(ret.raw.affectedRows);
        return await this.tagRepository.findOne({
            where: { name: createTagDto.name },
            relations: ['user'],
        });
    }

    async findAll() {
        return await this.tagRepository.find({ relations: ['user'] });
    }

    async findOne(id: string) {
        return await this.tagRepository.findOne({ where: { id: id }, relations: ['user'] });
    }

    async update(id: string, updateTagDto: UpdateTagDto, user: User) {
        const tag = await Tag.findOne({
            relations: ['user'],
            where: { id: id, user: { id: user.id } },
        });
        if (isNil(tag)) {
            return null;
        }

        Tag.update(id, {
            ...updateTagDto,
        });
        return await this.tagRepository.findOne({ where: { id: id }, relations: ['user'] });
    }

    async remove(id: string, user: User) {
        const tag = await Tag.findOne({
            relations: ['user'],
            where: { id: id, user: { id: user.id } },
        });
        if (isNil(tag)) {
            return;
        }

        await Tag.delete(id);
    }
}
