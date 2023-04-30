import { Controller, Get, Post, Body, Param, Delete, Inject, Query } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { isNil } from 'lodash';
import { User } from '../../common/decorators/user.decorator';
import { BaseController } from '../../common/base/controller.base';
import { Guest } from '../../common/decorators/guest.decorator';

import { GenerateSwaggerResponse } from '../../common/decorators/response.decorator';
import { CustomBaseResponse } from '../../common/base/response.dto';
import { CollectService } from './collect.service';
import { CollectEntity } from './entities/collect.entity';
import { CreateCollectDto, QueryCollectDto } from './collect.dto';
import { CommonResponseDto } from '../post/dto/common-response.dto';
import { PaginateDto } from '../../common/base/paginate.dto';

@Controller('collect')
export class CollectController extends BaseController {
    constructor(
        private readonly collectService: CollectService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        super();
    }

    @GenerateSwaggerResponse(CollectEntity, 'single')
    @Post()
    async create(
        @User() user,
        @Body() createCollectDto: CreateCollectDto,
    ): Promise<CustomBaseResponse<CollectEntity>> {
        return this.successResponse(await this.collectService.create(user, createCollectDto.title));
    }

    @GenerateSwaggerResponse(CollectEntity, 'page')
    @Get()
    @Guest()
    async list(
        @User() user,
        @Query() query: QueryCollectDto,
    ): Promise<CustomBaseResponse<CollectEntity>> {
        const userId = query.user ? query.user : user.id;
        if (isNil(userId)) {
            return this.failedResponse();
        }
        return this.successResponse(await this.collectService.list(user, query.page, query.limit));
    }

    @GenerateSwaggerResponse(CollectEntity, 'single')
    @Get(':id')
    @Guest()
    async findOne(
        @Param('id') id: number,
        @Query() query: PaginateDto,
    ): Promise<CommonResponseDto<CollectEntity>> {
        const collect = await CollectEntity.findOneBy({ id: id });
        if (isNil(collect)) {
            return this.failedResponse();
        }
        return this.successResponse(
            await this.collectService.getPosts(collect, query.page, query.limit),
        );
    }

    @Delete(':id')
    async remove(@Param('id') id: number, @User() user) {
        const collect = await CollectEntity.findOneBy({ id: id });
        if (isNil(collect) || collect.user.id !== user.id) {
            return this.failedResponse();
        }
        return this.successResponse(this.collectService.delete(collect));
    }
}
