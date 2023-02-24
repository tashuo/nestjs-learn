import { IsNotEmpty, Length } from 'class-validator';

export class CreateTagDto {
    @Length(1, 20)
    @IsNotEmpty({ message: 'tag name cannot be empty' })
    readonly name: string;
}
