import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class LikeDto {
    @IsNotEmpty()
    @IsNumber()
    post: number;
}

export class UnlikeDto extends LikeDto {}
