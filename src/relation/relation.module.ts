import { Module } from '@nestjs/common';
import { RelationService } from './relation.service';
import { RelationController } from './relation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Demo } from './entities/Demo';
import { Demo1 } from './entities/demo1.entity';
import { MessageProducerService } from './message.producer.service';
import { BullModule } from '@nestjs/bull';
import { MessageConsumer } from './message.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Demo, Demo1]),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'test-queue',
    }),
  ],
  controllers: [RelationController],
  providers: [RelationService, MessageProducerService, MessageConsumer],
})
export class RelationModule {}
