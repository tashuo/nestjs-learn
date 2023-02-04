import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';

@Processor('default')
@Injectable()
export class DefaultConsumer {
    @Process()
    async test(job: Job<unknown>) {
        console.log(`消费：${job.id}`);
    }
}
