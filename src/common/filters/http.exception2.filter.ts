import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    ServiceUnavailableException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(ServiceUnavailableException)
export class HttpException2Filter implements ExceptionFilter {
    catch(exception: ServiceUnavailableException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
