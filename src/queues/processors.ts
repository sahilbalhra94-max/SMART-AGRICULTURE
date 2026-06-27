import { Module, Logger } from '@nestjs/common';
import { ScheduleModule, Cron, CronExpression } from '@nestjs/schedule';

const logger = new Logger('QueueModule');

let BullMQModule: any;
let bullmqAvailable = false;

try {
  const bullmq = require('@nestjs/bullmq');
  BullMQModule = bullmq.BullMQModule;
  bullmqAvailable = true;
} catch {
  logger.warn('BullMQ/Redis not available. Queue processing disabled.');
}

const providers: any[] = [];
const imports: any[] = [ScheduleModule];

if (bullmqAvailable) {
  try {
    const Redis = require('ioredis');
    const redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: true,
    });
    redis.connect().catch(() => {
      logger.warn('Redis connection failed. Queue processing disabled.');
      bullmqAvailable = false;
    });
  } catch {
    bullmqAvailable = false;
  }
}

@Module({
  imports,
  providers: [
    {
      provide: 'QUEUE_STATUS',
      useFactory: () => ({
        redisAvailable: bullmqAvailable,
        get status() {
          return bullmqAvailable ? 'active' : 'disabled';
        },
      }),
    },
  ],
  exports: ['QUEUE_STATUS'],
})
export class QueueModule {
  @Cron(CronExpression.EVERY_5_MINUTES)
  handleQueueHealthCheck() {
    if (!bullmqAvailable) {
      logger.debug('Queue processing skipped - Redis not available');
    }
  }
}
