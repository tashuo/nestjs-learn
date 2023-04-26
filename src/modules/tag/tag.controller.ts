import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { User } from '../../common/decorators/user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { BaseController } from '../../common/base/controller.base';

@Controller('tag')
export class TagController extends BaseController {
    constructor(private readonly tagService: TagService) {
        super();
    }

    @Post()
    async create(@Body() createTagDto: CreateTagDto, @User() user: UserEntity) {
        return this.successResponse(await this.tagService.create(createTagDto, user));
    }

    @Get()
    findAll() {
        return this.tagService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tagService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto, @User() user: UserEntity) {
        return this.tagService.update(id, updateTagDto, user);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @User() user: UserEntity) {
        return this.tagService.remove(id, user);
    }
}
