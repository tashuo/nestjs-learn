import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateCommentDto {
    @IsNumber()
    readonly post: number;

    @IsString()
    @Length(1, 10000)
    readonly content: string;

    @IsNumber()
    @IsOptional()
    readonly parent: number;
}
