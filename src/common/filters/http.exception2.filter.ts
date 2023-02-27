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
        const status = exception.getStatus();
        response.status(status).json({
            code: status,
            timestamp: new Date().toISOString(),
            message: 'something goes wrong~',
        });
    }
}
