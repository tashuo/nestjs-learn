import { IsArray, IsOptional, Length } from 'class-validator';

export class CreatePostDto {
    @IsOptional()
    @Length(1, 20)
    readonly title?: string;

    /**
     * 文章内容
     * @example 珍香又上二楼睡觉
     */
    @Length(2, 10000)
    readonly content: string;

    /**
     * 图片路径列表
     * @example ['/12/a.png','/3/b.jpg']
     */
    @IsOptional()
    readonly images?: string[];

    @IsArray()
    @IsOptional()
    readonly tags?: string[];
}
