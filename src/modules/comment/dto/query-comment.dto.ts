import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { PaginateDto } from 'src/common/base/paginate.dto';
import { toNumber } from 'lodash';

export class QueryPostCommentDto extends PaginateDto {
    @IsNumber()
    @Transform(({ value }) => toNumber(value))
    readonly post: number;
}

export class QueryChildrenCommentDto extends PaginateDto {
    @IsNumber()
    @Transform(({ value }) => toNumber(value))
    readonly parent: number;
}
