import { Module } from '@nestjs/common';
import { NoticeEntity } from './entities/notice.entity';
import { NoticeListener } from './notice.listener';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';

@Module({
    controllers: [NoticeController],
    imports: [NoticeEntity],
    providers: [NoticeService, NoticeListener],
    exports: [NoticeService],
})
export class NoticeModule {}
