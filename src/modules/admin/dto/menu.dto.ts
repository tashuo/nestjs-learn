import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNumber, IsOptional, Length } from 'class-validator';

export class CreateMenuDto {
    @Length(2, 6)
    name: string;

    @Length(2, 20)
    path: string;

    @IsOptional()
    icon: string;

    @IsOptional()
    parent?: number;

    @IsOptional()
    roles?: number[];
}

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}

export class MenuDto {
    @IsNumber()
    id: number;

    @IsArray()
    children: MenuDto[];

    @IsOptional()
    parent?: MenuDto;
}
