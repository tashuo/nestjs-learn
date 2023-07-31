import { Controller, Get, Post, Body, Param, Delete, Inject, Query } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { isNil } from 'lodash';
import { AuthUser } from '../../common/decorators/authUser.decorator';
import { BaseController } from '../../common/base/controller.base';
import { Guest } from '../../common/decorators/guest.decorator';

import { GenerateSwaggerResponse } from '../../common/decorators/response.decorator';
import { CustomBaseResponse } from '../../common/base/response.dto';
import { CollectService } from './collect.service';
import { CollectEntity } from './entities/collect.entity';
import { CreateCollectDto, QueryCollectDto } from './collect.dto';
import { CommonResponseDto } from '../post/dto/common-response.dto';
import { PaginateDto } from '../../common/base/paginate.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IAuthUser } from 'src/interfaces/auth';
import { UserEntity } from '../user/entities/user.entity';

@ApiBearerAuth()
@ApiTags('收藏夹')
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
        @AuthUser() user: IAuthUser,
        @Body() createCollectDto: CreateCollectDto,
    ): Promise<CustomBaseResponse<CollectEntity>> {
        return this.successResponse(
            await this.collectService.create(
                await UserEntity.findOneBy({ id: user.userId }),
                createCollectDto.title,
            ),
        );
    }

    @GenerateSwaggerResponse(CollectEntity, 'page')
    @Get()
    @Guest()
    async list(
        @AuthUser() user: IAuthUser,
        @Query() query: QueryCollectDto,
    ): Promise<CustomBaseResponse<CollectEntity>> {
        const userId = query.user ? query.user : user.userId;
        if (isNil(userId)) {
            return this.failedResponse();
        }
        return this.successResponse(
            await this.collectService.list(
                await UserEntity.findOneBy({ id: user.userId }),
                query.page,
                query.limit,
            ),
        );
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
    async remove(@Param('id') id: number, @AuthUser() user: IAuthUser) {
        const collect = await CollectEntity.findOneBy({ id: id });
        if (isNil(collect) || collect.user.id !== user.userId) {
            return this.failedResponse();
        }
        return this.successResponse(this.collectService.delete(collect));
    }
}
