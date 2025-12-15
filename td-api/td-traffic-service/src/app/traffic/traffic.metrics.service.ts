import { Injectable } from '@nestjs/common';
import * as os from 'node:os';
import { performance, monitorEventLoopDelay } from 'node:perf_hooks';
import {TrafficMetricsDto} from "@mh-traffic/mh-types";

@Injectable()
export class TrafficMetricsService {
  private readonly elDelay = monitorEventLoopDelay({ resolution: 20 });

  constructor() {
    this.elDelay.enable();
  }

  snapshot(): TrafficMetricsDto {
    const mem = process.memoryUsage();
    const totalMem = os.totalmem();
    const rssPercentOfSystem = totalMem > 0 ? (mem.rss / totalMem) * 100 : 0;

    const heapUsagePercent = mem.heapTotal > 0 ? (mem.heapUsed / mem.heapTotal) * 100 : 0;

    const cpu = process.cpuUsage();
    // Very lightweight approximation: convert user+system micros to a percent of 1 core over 1s.
    // For real accuracy you’d store previous reading; we keep it simple for now.
    const processPercent = ((cpu.user + cpu.system) / 1_000_000) * 100;

    const elu = performance.eventLoopUtilization();

    return {
      pid: process.pid,
      uptimeSec: Math.floor(process.uptime()),
      cpu: { processPercent: Number(processPercent.toFixed(2)) },
      memory: {
        rssBytes: mem.rss,
        heapUsedBytes: mem.heapUsed,
        heapTotalBytes: mem.heapTotal,
        heapUsagePercent: Number(heapUsagePercent.toFixed(2)),
        rssPercentOfSystem: Number(rssPercentOfSystem.toFixed(2)),
      },
      system: {
        loadAvg1m: os.loadavg()[0] ?? 0,
        totalMemBytes: totalMem,
        freeMemBytes: os.freemem(),
      },
      eventLoop: {
        utilizationPercent: Number((elu.utilization * 100).toFixed(2)),
        delayMeanMs: Number((this.elDelay.mean / 1e6).toFixed(2)),
        delayMaxMs: Number((this.elDelay.max / 1e6).toFixed(2)),
      },
    };
  }
}
