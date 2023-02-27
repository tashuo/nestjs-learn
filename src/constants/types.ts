import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class ApiResponse<T> {
    code: string;
    message: string;
    data: T;
    timestamp: Date;
}

// export class TestDto {
//     @IsNumber()
//     code: number;

//     @IsOptional()
//     @Length(0, 1000)
//     message: string;
// }
