import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class MessageProducerService {
  constructor(@InjectQueue('test-queue') private queue: Queue) {}

  async sendMessage(mes) {
    console.log('test');
    await this.queue.add('test-job', {
      text: mes,
    });
  }
}
