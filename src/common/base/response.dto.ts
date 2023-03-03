import {
    ICustomBaseResponse,
    ICustomListResponse,
    ICustomNormalResponse,
    ICustomPaginationData,
    ICustomPaginationResponse,
} from 'src/interfaces/response';

export class CustomBaseResponse<T> implements ICustomBaseResponse<T> {
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
     * response timestamp
     * @example 0
     */
    timestamp: Date;

    /**
     * response data
     */
    data?: T | T[] | ICustomPaginationData<T>;

    constructor(code: number, message = '', data: T, timestamp = new Date()) {
        this.code = code;
        this.message = message;
        this.timestamp = timestamp;
        this.data = data;
    }
}

export class CustomNormalResponse<T>
    extends CustomBaseResponse<T>
    implements ICustomNormalResponse<T>
{
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
     * response timestamp
     * @example 0
     */
    timestamp: Date;

    /**
     * response data
     */
    data?: T;
}

export class CustomListResponse<T> extends CustomBaseResponse<T> implements ICustomListResponse<T> {
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
     * response timestamp
     * @example 0
     */
    timestamp: Date;

    /**
     * response data
     */
    data?: T[];
}

export class CustomPaginationResponse<T>
    extends CustomBaseResponse<T>
    implements ICustomPaginationResponse<T>
{
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
     * response timestamp
     * @example 0
     */
    timestamp: Date;

    /**
     * response data
     */
    data?: ICustomPaginationData<T>;
}
