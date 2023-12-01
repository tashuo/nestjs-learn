import { IsOptional } from "class-validator";
import { AntdProPaginateDto } from "src/common/base/paginate.dto";

export class UsersDto extends AntdProPaginateDto {
    @IsOptional()
    id?: number;

    @IsOptional()
    username?: string;
}