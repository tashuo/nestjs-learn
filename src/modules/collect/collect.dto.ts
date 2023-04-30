import { PartialType } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginateDto } from 'src/common/base/paginate.dto';

export class QueryCollectDto extends PaginateDto {
    @IsNumber()
    @IsNotEmpty()
    user: number;
}
export class CreateCollectDto {
    @MaxLength(25, {
        always: true,
        message: '收藏夹名称长度不得超过$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '收藏夹名称不得为空' })
    @IsOptional({ groups: ['update'] })
    @IsString()
    title!: string;
}

export class UpdateCollectDto extends PartialType(CreateCollectDto) {
    @IsDefined({ groups: ['update'], message: '收藏夹ID必须指定' })
    @IsNumber()
    id!: string;
}
