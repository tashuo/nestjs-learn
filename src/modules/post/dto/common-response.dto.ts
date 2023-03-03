export class CommonResponseDto<T> {
    /**
     * response code
     * @example 200
     */
    code: number;

    /**
     * error message, default empty
     * @example permission denied
     */
    message?: string;

    /**
     * response data
     */
    data?: T;

    /**
     * response timestamp
     * @example 2023-03-03T07:17:32.020Z
     */
    timestamp: Date;
}
