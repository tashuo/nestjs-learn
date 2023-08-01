import { Injectable } from '@nestjs/common';

import { NoticeEntity } from './entities/notice.entity';
import { QueryDto } from './notice.dto';
import { convertToCursorPaginationResponse } from 'src/utils/helper';
import { ICustomCursorPaginationData } from 'src/interfaces/response';

@Injectable()
export class NoticeService {
    async paginate(
        userId: number,
        queryDto: QueryDto,
    ): Promise<ICustomCursorPaginationData<NoticeEntity>> {
        const query = NoticeEntity.createQueryBuilder('notice')
            .leftJoinAndSelect('notice.operator', 'operator')
            .leftJoinAndSelect('notice.post', 'post')
            .leftJoinAndSelect('notice.comment', 'comment')
            .where('notice.type = :type', { type: queryDto.type });
        if (queryDto.cursor > 0) {
            query.andWhere('notice.id > :cursor', { cursor: queryDto.cursor });
        }
        query.andWhere('notice.userId = :userId', { userId: userId }).take(queryDto.limit);
        const notices = await query.getMany();
        return convertToCursorPaginationResponse(
            { limit: queryDto.limit, cursor: notices.length > 0 ? notices.at(-1).id : 0 },
            notices,
        );
    }

    async getUnreadNoticeCount(userId: number, type?: string): Promise<number> {
        const query = NoticeEntity.createQueryBuilder()
            .where('userId = :userId', { userId })
            .andWhere('is_read = :is_read', { is_read: false });
        if (type) {
            query.andWhere('type = :type', { type });
        }
        return query.getCount();
    }
}
