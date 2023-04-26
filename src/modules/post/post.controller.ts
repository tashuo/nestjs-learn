import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    ParseArrayPipe,
    Inject,
    InternalServerErrorException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { User } from 'src/common/decorators/user.decorator';
import { BaseController } from 'src/common/base/controller.base';
import { ApiCreatedResponse, ApiExtraModels } from '@nestjs/swagger';
import { PostEntity } from './entities/post.entity';
import { CommonResponseDto } from './dto/common-response.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { Guest } from 'src/common/decorators/guest.decorator';

import { GenerateSwaggerResponse } from 'src/common/decorators/response.decorator';
import { CustomBaseResponse } from 'src/common/base/response.dto';

@Controller('post')
export class PostController extends BaseController {
    constructor(
        private readonly postService: PostService,
        @InjectQueue('default') private queue: Queue,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        super();
    }

    @ApiExtraModels(PostEntity)
    @GenerateSwaggerResponse(PostEntity, 'single')
    @Post()
    async create(
        @User() user,
        @Body() createPostDto: CreatePostDto,
    ): Promise<CustomBaseResponse<PostEntity>> {
        return this.successResponse(await this.postService.create(createPostDto, user));
    }

    // TypeScript 不存储泛型或接口的元数据，因此当你在 DTO 中使用它们的时候， ValidationPipe 可能不能正确验证输入数据
    // 要验证数组，创建一个包裹了该数组的专用类，或者使用 ParseArrayPipe
    @Post('batch')
    createBatch(
        @Req() Req,
        @Body(new ParseArrayPipe({ items: CreatePostDto })) createPostDtos: CreatePostDto[],
    ) {
        console.log(createPostDtos);
        return 'testing';
    }

    @GenerateSwaggerResponse(PostEntity, 'page')
    @Guest()
    @Get()
    async findAll(): Promise<CustomBaseResponse<PostEntity>> {
        return this.successResponse(await this.postService.findAll());
    }

    @GenerateSwaggerResponse(PostEntity, 'single')
    @Guest()
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<CommonResponseDto<PostEntity>> {
        return this.successResponse(await this.postService.findOne(+id));
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postService.update(+id, updatePostDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.postService.remove(+id);
    }
}
