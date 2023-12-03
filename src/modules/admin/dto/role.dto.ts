import { PartialType } from "@nestjs/mapped-types";
import { IsArray, IsDefined, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class CreateRoleDto {
    @IsString()
    @Length(2, 20)
    name: string;

    @IsString()
    @Length(2, 20)
    slug: string;

    @IsNumber({},{each: true})
    @IsOptional()
    menus?: number[];
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}