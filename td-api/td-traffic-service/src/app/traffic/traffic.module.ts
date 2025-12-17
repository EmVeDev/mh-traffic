import { Module } from '@nestjs/common';
import { TrafficMessageHandler } from './traffic.message-handler';
import { TrafficMetricsService } from './traffic.metrics.service';

@Module({
  controllers: [TrafficMessageHandler],
  providers: [TrafficMetricsService],
})
export class TrafficModule {}
