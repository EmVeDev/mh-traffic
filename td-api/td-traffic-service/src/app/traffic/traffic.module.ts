import { Module } from '@nestjs/common';
import { TrafficMessageHandler } from './traffic.message-handler';
import { TrafficMetricsService } from './traffic.metrics.service';

@Module({
  providers: [TrafficMessageHandler, TrafficMetricsService],
})
export class TrafficModule {}
