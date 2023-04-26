import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { toNumber } from 'lodash';

export class PaginateDto {
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => toNumber(value))
    @Min(1, { message: 'must larger than 0' })
    page = 1;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => toNumber(value))
    @Min(1, { message: 'must larger than 0' })
    limit = 10;
}
