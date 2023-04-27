import { Controller, Get, Post, Body, Param, Delete, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { User } from 'src/common/decorators/user.decorator';
import { BaseController } from 'src/common/base/controller.base';
import { ApiExtraModels } from '@nestjs/swagger';
import { Guest } from 'src/common/decorators/guest.decorator';

import { GenerateSwaggerResponse } from 'src/common/decorators/response.decorator';
import { CustomBaseResponse } from 'src/common/base/response.dto';
import { CollectService } from './collect.service';
import { CollectEntity } from './entities/collect.entity';
import { CreateCollectDto } from './collect.dto';
import { CommonResponseDto } from '../post/dto/common-response.dto';

@Controller('collect')
export class CollectController extends BaseController {
    constructor(
        private readonly collectService: CollectService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        super();
    }

    @ApiExtraModels(CollectEntity)
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
    async list(@User() user): Promise<CustomBaseResponse<CollectEntity>> {
        return this.successResponse(await this.collectService.list(user));
    }

    @GenerateSwaggerResponse(CollectEntity, 'single')
    @Guest()
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<CommonResponseDto<CollectEntity>> {
        return this.successResponse(await this.collectService.getPosts(id));
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.successResponse(this.collectService.delete(id));
    }
}
