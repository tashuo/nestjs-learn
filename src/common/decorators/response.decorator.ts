import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { CommonResponseDto } from 'src/modules/post/dto/common-response.dto';
import { CustomPaginationResponse, CustomListResponse } from '../base/response.dto';

export const GenerateSwaggerResponse = <Entity extends Type<unknown>>(
    Entity: Entity,
    type: 'single' | 'list' | 'page',
) => {
    let data: any;
    switch (type) {
        case 'single':
            data = {
                $ref: getSchemaPath(Entity),
            };
            break;
        case 'list':
            data = {
                properties: {
                    type: 'array',
                    items: { $ref: getSchemaPath(Entity) },
                },
            };
            break;
        case 'page':
            data = {
                properties: {
                    items: {
                        type: 'array',
                        items: { $ref: getSchemaPath(Entity) },
                    },
                    page: {
                        type: 'number',
                        default: 1,
                    },
                    pageSize: {
                        type: 'number',
                        default: 10,
                    },
                    total: {
                        type: 'number',
                        default: 10,
                    },
                },
            };
            break;
    }
    return applyDecorators(
        ApiExtraModels(CustomPaginationResponse, Entity),
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(CustomPaginationResponse) },
                    {
                        properties: {
                            data: data,
                        },
                    },
                ],
            },
        }),
    );
};
