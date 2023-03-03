export interface ICustomBaseResponse<T = any> {
    code: number;
    message?: string;
    timestamp: Date;
    data?: T | T[] | ICustomPaginationData<T>;
}

export interface ICustomNormalResponse<T> extends ICustomBaseResponse<T> {
    data?: T;
}

export interface ICustomListResponse<T> extends ICustomBaseResponse<T> {
    data?: T[];
}

export interface ICustomPaginationResponse<T> extends ICustomBaseResponse<T> {
    data?: ICustomPaginationData<T>;
}

export type ICustomPaginationData<T> = ICustomPagination & { items: T[] };

export interface ICustomPagination {
    page: number;
    pageSize: number;
    total: number;
}
