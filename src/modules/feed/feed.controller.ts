import { Controller, Get, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { User } from 'src/common/decorators/user.decorator';
import { BaseController } from 'src/common/base/controller.base';
import { Guest } from 'src/common/decorators/guest.decorator';
import { GenerateSwaggerResponse } from 'src/common/decorators/response.decorator';
import { CustomBaseResponse } from 'src/common/base/response.dto';
import { FeedService } from './feed.service';
import { UserEntity } from '../user/entities/user.entity';
import { PostEntity } from '../post/entities/post.entity';

@Controller('feed')
export class FeedController extends BaseController {
    constructor(
        private readonly feedService: FeedService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        super();
    }

    @GenerateSwaggerResponse(PostEntity, 'page')
    @Guest()
    @Get()
    async list(@User() user: UserEntity): Promise<CustomBaseResponse<PostEntity>> {
        return this.successResponse(await this.feedService.getTimelineFeeds(user.id));
    }
}
