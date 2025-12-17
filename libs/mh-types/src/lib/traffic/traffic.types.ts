import { IsNumber, IsObject, IsString } from 'class-validator';

export class TrafficMetricsDto {
  @IsNumber()
  pid!: number;

  @IsNumber()
  uptimeSec!: number;

  @IsObject()
  cpu!: { processPercent: number };

  @IsObject()
  memory!: {
    rssBytes: number;
    heapUsedBytes: number;
    heapTotalBytes: number;
    heapUsagePercent: number;
    rssPercentOfSystem: number;
  };

  @IsObject()
  system!: {
    loadAvg1m: number;
    totalMemBytes: number;
    freeMemBytes: number;
  };

  @IsObject()
  eventLoop!: {
    utilizationPercent: number;
    delayMeanMs: number;
    delayMaxMs: number;
  };
}

export class TrafficStatusResponseDto {
  @IsString()
  status!: 'ok';

  @IsNumber()
  timestamp!: number;

  @IsObject()
  metrics!: TrafficMetricsDto;
}
