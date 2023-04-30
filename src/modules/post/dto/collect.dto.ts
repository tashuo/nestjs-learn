import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PostCollectDto {
    @IsNotEmpty()
    @IsNumber()
    post: number;

    @IsNotEmpty()
    @IsNumber()
    collect: number;

    @IsString()
    remark?: string;
}

export class CancelPostCollectDto extends PostCollectDto {}
