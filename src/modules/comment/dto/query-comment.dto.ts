import { IsNumber } from 'class-validator';
import { PaginateDto } from 'src/common/base/paginate.dto';

export class QueryPostCommentDto extends PaginateDto {
    @IsNumber()
    readonly post: number;
}

export class QueryChildrenCommentDto extends PaginateDto {
    @IsNumber()
    readonly parent: number;
}
