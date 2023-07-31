import { IsNotEmpty, IsNumber } from 'class-validator';

export class LikeDto {
    @IsNotEmpty()
    @IsNumber()
    comment: number;
}

export class UnlikeDto extends LikeDto {}
