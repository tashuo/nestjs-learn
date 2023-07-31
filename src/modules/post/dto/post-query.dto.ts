import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { PaginateDto } from 'src/common/base/paginate.dto';

export class QueryLikePostDto extends PaginateDto {
    /**
     * 用户ID
     */
    @IsNumber()
    @Type(() => Number)
    user: number;
}

export class QueryPostDto extends PartialType<QueryLikePostDto>(QueryLikePostDto) {}

export class QueryCollectdPostDto extends QueryLikePostDto {
    /**
     * 收藏夹ID
     */
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    collect?: number;
}
