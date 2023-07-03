import { ClassSerializerInterceptor, Injectable, UseInterceptors } from '@nestjs/common';
import { RESPONSE_CODE_FAILED, RESPONSE_CODE_SUCCESS } from '../../constants/response.code';
import { CustomBaseResponse } from './response.dto';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export abstract class BaseController {
    async successResponse(data?: any): Promise<any> {
        return this.response(RESPONSE_CODE_SUCCESS, data);
    }

    async failedResponse(code?: number, data?: any, message?: string): Promise<any> {
        return this.response(code ?? RESPONSE_CODE_FAILED, data ?? {}, message ?? '');
    }

    async response(code?: number, data?: any, message?: string): Promise<any> {
        return new CustomBaseResponse(code, message, data);
    }
}
