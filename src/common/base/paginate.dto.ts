import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { toNumber } from 'lodash';

export class PaginateDto {
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => toNumber(value))
    @Min(1, { message: 'must larger than 0' })
    page?: number = 1;

    /**
     * 游标，暂时只处理数字主键
     */
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => toNumber(value))
    cursor?: number = 0;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => toNumber(value))
    @Min(1, { message: 'must larger than 0' })
    limit?: number = 10;
}
