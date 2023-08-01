import { PickType } from '@nestjs/swagger';
import { NoticeTypes } from './types';
import { PaginateDto } from 'src/common/base/paginate.dto';

export class QueryDto extends PaginateDto {
    /**
     * 类型
     * @example like
     */
    type: NoticeTypes;
}

export class MarkReadDto extends PickType(QueryDto, ['type']) {}
