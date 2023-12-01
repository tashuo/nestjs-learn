import { IsOptional } from "class-validator";
import { AntdProPaginateDto } from "src/common/base/paginate.dto";

export class PostDto extends AntdProPaginateDto {
    @IsOptional()
    id?: number;

    @IsOptional()
    title?: string;

    @IsOptional()
    content?: string;
}