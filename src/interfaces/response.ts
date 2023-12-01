export interface ICustomBaseResponse<T = any> {
    code: number;
    message?: string;
    timestamp: Date;
    data?: T | T[] | ICustomPaginationData<T> | ICustomCursorPaginationData<T>;
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

// 定义为interface swagger会报循环依赖？
export type ICustomPaginationData<T> = { meta: ICustomPagination } & { items: T[] };
// export interface ICustomPaginationData<T> {
//     meta: ICustomPagination;
//     items: T[];
// }

export type ICustomCursorPaginationData<T> = { meta: ICustomCursorPagination } & { items: T[] };
// export interface ICustomCursorPaginationData<T> {
//     meta: ICustomCursorPagination;
//     items: T[];
// }

export interface ICustomPagination {
    page: number;
    nextPage: number;
    limit: number;
    totalPages: number;
    total: number;
}

export interface ICustomAntdProPagination<T> {
    data: T[],
    success: boolean,
    current: number;
    pageSize: number;
    totalPages: number;
    total: number;
}

export interface ICustomCursorPagination {
    cursor: number;
    limit: number;
    hasMore: boolean;
}
