import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { NoticeEntity } from './entities/notice.entity';
import { MarkReadDto, QueryDto } from './notice.dto';
import { NoticeService } from './notice.service';
import { NoticeTypes } from './types';
import { AuthUser } from 'src/common/decorators/authUser.decorator';
import { IAuthUser } from 'src/interfaces/auth';

@ApiTags('通知消息')
@ApiBearerAuth()
@Controller('notice')
export class NoticeController {
    constructor(private readonly service: NoticeService) {}

    @ApiOperation({ summary: '消息列表' })
    @Get()
    async list(@Query() dto: QueryDto, @AuthUser() user: IAuthUser) {
        return this.service.paginate(user.userId, dto);
    }

    @ApiOperation({ summary: '通知概要' })
    @Get('/summary')
    async summary(@AuthUser() user: IAuthUser) {
        return NoticeEntity.createQueryBuilder()
            .where('userId = :userId', { userId: user.userId })
            .andWhere(`type IN(:...types)`, { types: Object.values(NoticeTypes) })
            .andWhere('is_read = :is_read', { is_read: false })
            .groupBy('type')
            .select('`type`, COUNT(`id`) AS `c`')
            .getRawMany();
    }

    @ApiOperation({ summary: '标记已读' })
    @Post('/markRead')
    async markRead(@Body() dto: MarkReadDto, @AuthUser() user: IAuthUser) {
        console.log(dto, user);
        return NoticeEntity.createQueryBuilder()
            .where('userId = :userId', { userId: user.userId })
            .andWhere('type = :type', { type: dto.type })
            .andWhere('is_read = :is_read', { is_read: false })
            .update({
                is_read: true,
            })
            .execute();
    }
}
