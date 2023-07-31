import { IsNotEmpty, IsNumber } from 'class-validator';

export class LikeDto {
    @IsNotEmpty()
    @IsNumber()
    post: number;
}

export class UnlikeDto extends LikeDto {}
