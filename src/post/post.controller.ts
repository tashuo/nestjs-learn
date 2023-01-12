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
    HttpException,
    InternalServerErrorException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService,
        @InjectQueue('default') private queue: Queue,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    @Post()
    create(@Req() req, @Body() createPostDto: CreatePostDto) {
        return this.postService.create(createPostDto, req.user.id);
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

    @Get()
    findAll() {
        return this.postService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        throw new InternalServerErrorException('test error');
        await this.queue.add({ job: `id-${id}` });
        this.logger.debug('debug test');
        this.logger.info('info test');
        this.logger.warn('warn test');
        this.logger.error('errortest');
        return this.postService.findOne(+id);
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
