import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { PaginateDto } from 'src/common/base/paginate.dto';

@Injectable()
export class FollowDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;
}

@Injectable()
export class UnfollowDto extends FollowDto {}

@Injectable()
export class QueryFollowersDto extends PaginateDto {}

@Injectable()
export class QueryFollowingsDto extends PaginateDto {}
