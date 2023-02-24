import { ContentType } from '../entities/post.entity';
import { IsArray, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreatePostDto {
    @Length(1, 20)
    readonly title: string;

    @Length(2, 10000)
    readonly content: string;

    @IsNotEmpty()
    readonly content_type: ContentType;

    @IsArray()
    @IsOptional()
    readonly tags: string[];
}
