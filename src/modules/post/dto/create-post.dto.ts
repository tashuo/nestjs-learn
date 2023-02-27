import { ContentType } from '../entities/post.entity';
import { IsArray, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
    @ApiProperty()
    @Length(1, 20)
    readonly title: string;

    /**
     * 文章内容
     * @example 珍香又上二楼睡觉
     */
    @Length(2, 10000)
    readonly content: string;

    @IsNotEmpty()
    readonly content_type: ContentType;

    @IsArray()
    @IsOptional()
    readonly tags: string[];
}
