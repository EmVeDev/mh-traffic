import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TrafficMetricsService } from './traffic.metrics.service';
import {TrafficStatusResponseDto, TRAFFIC_PATTERNS} from "@mh-traffic/mh-types";

@Controller()
export class TrafficMessageHandler {
  constructor(private readonly metrics: TrafficMetricsService) {
  }

  @MessagePattern(TRAFFIC_PATTERNS.getStatus)
  getStatus(): TrafficStatusResponseDto {
    return {
      status: 'ok',
      timestamp: Date.now(),
      metrics: this.metrics.snapshot(),
    };
  }
}
