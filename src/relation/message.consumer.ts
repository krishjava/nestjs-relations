import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('test-queue')
export class MessageConsumer {
  @Process('test-job')
  messageJob(job: Job) {
    console.log('job ', job.data);
  }
}
