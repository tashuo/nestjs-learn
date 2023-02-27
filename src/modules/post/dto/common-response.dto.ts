import { IsNumber, Length } from 'class-validator';

export class CommonResponseDto<T> {
    /**
     * response code
     * @example 200
     */
    @IsNumber()
    code: number;

    /**
     * error message, default empty
     * @example permission denied
     */
    @Length(0, 1000)
    message?: string;

    /**
     * response data
     */
    data?: T;

    /**
     * response timestamp
     * @example 0
     */
    timestamp: Date;
}
