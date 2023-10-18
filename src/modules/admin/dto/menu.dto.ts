import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, Length } from 'class-validator';

export class CreateMenuDto {
    @Length(2, 6)
    name: string;

    @Length(2, 20)
    path: string;

    @IsOptional()
    icon: string;

    @IsOptional()
    parent: number;

    @IsOptional()
    roles: number[];
}

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}

export class SetMenusDto {
    /**
     * json数组
     * @example [{\"id\":1},{\"id\":2,\"children\":[{\"id\":3},{\"id\":4},{\"id\":9,\"children\":[{\"id\":10}]},{\"id\":5},{\"id\":6},{\"id\":7}]},{\"id\":8}]
     */
    @Length(5, 5000)
    menus: string;
}
