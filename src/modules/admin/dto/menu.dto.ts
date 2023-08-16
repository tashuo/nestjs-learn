import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, Length } from 'class-validator';

export class CreateMenuDto {
    @Length(2, 6)
    name: string;

    @Length(2, 20)
    uri: string;

    @IsOptional()
    icon: string;

    @IsOptional()
    parent: number;

    @IsOptional()
    roles: number[];
}

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}

export class SetMenusDto {
    @Length(5, 5000)
    menus: string;
}
