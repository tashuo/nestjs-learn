import { IsNumber, Length } from 'class-validator';
import { PostEntity } from '../entities/post.entity';

export class PostResponseDto {
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
    data?: PostEntity;

    /**
     * response timestamp
     */
    timestamp: Date;
}
