export class ApiResponse<T> {
    code: string;
    message: string;
    data: T;
    timestamp: Date;
}
