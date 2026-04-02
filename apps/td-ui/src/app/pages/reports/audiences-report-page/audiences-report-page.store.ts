import { computed, Injectable } from '@angular/core';
import type {
  MhdChartConfig,
  MhdChartPoint,
  ReportTableColumn,
  ReportTableRow,
} from '@mh-traffic/mh-design';
import { createReportBaseStore } from '../shared/create-report-base-store';
import {
  createAudiencesBreakdownOptions,
  createPrimaryReportMetricOptions,
} from '../shared/report-filter-options';
import {
  createGenericOverviewLeftGroups,
  createGenericOverviewRightGroups,
} from '../shared/simple-report-page-helpers';

@Injectable()
export class AudiencesReportPageStore {
  readonly base = createReportBaseStore();

  readonly title = 'Audiences report';
  readonly overviewTitle = 'How audiences generate pageviews';
  readonly tableTitle =
    'How do audiences differ when broken down by main metrics';
  readonly firstColumnHeader = 'audiences';

  readonly overviewLeftGroups = computed(() =>
    createGenericOverviewLeftGroups()
  );

  readonly overviewRightGroups = computed(() =>
    createGenericOverviewRightGroups()
  );

  readonly overviewChart = computed<MhdChartConfig>(() => {
    const start = Date.UTC(2026, 2, 31, 0, 0, 0, 0);
    const end = Date.UTC(2026, 2, 31, 23, 59, 0, 0);
    const now = Date.UTC(2026, 2, 31, 15, 0, 0, 0);

    return {
      type: 'area',
      allowedTypes: ['line', 'area', 'bar'],
      showLegend: true,
      showGrid: true,
      yAxisTicks: 3,
      currentTimeX: now,
      xAxisFormatter: (value: number) => this.formatHour(value),
      yAxisFormatter: (value: number) => {
        if (value >= 1_000_000) {
          return `${(value / 1_000_000).toFixed(1)}M`;
        }

        if (value >= 1_000) {
          return `${Math.round(value / 1_000)}k`;
        }

        return `${Math.round(value)}`;
      },
      series: [
        {
          id: 'historical-average',
          label: 'Average past 4 weeks',
          color: '#cfcfcf',
          comparison: true,
          data: this.createHistoricalDaySeries(start, end),
        },
        {
          id: 'current-day',
          label: 'Current day',
          color: '#15b8ff',
          data: this.createCurrentDaySeries(start, now),
        },
      ],
    };
  });

  readonly tableColumns = computed<ReportTableColumn[]>(() => [
    {
      key: 'pageviews',
      label: 'Pageviews',
      align: 'right',
      type: 'number',
    },
    {
      key: 'totalAttention',
      label: 'Total Attention',
      align: 'right',
    },
    {
      key: 'reads',
      label: 'Reads',
      align: 'right',
      type: 'number',
    },
  ]);

  readonly tableRows = computed<ReportTableRow[]>(() => [
    {
      id: 'anonymous',
      name: 'Anonymous',
      link: '/content/audiences/anonymous',
      values: {
        pageviews: 513070,
        totalAttention: '584 293 min',
        reads: 740975,
      },
    },
    {
      id: 'registered',
      name: 'Registered',
      link: '/content/audiences/registered',
      values: {
        pageviews: 236993,
        totalAttention: '341 710 min',
        reads: 275961,
      },
    },
    {
      id: 'subscribers',
      name: 'Subscribers',
      link: '/content/audiences/subscribers',
      values: {
        pageviews: 224795,
        totalAttention: '232 717 min',
        reads: 247970,
      },
    },
  ]);

  readonly tableTotals = computed(() => null);

  constructor() {
    this.base.metricOptions.set(createPrimaryReportMetricOptions());
    this.base.selectedMetricValue.set('pageviews');

    this.base.breakdownOptions.set(createAudiencesBreakdownOptions());
    this.base.selectedBreakdownValue.set('audiences');

    this.base.tableDisplayMode.set('table');
    this.base.valueDisplayMode.set('raw');
  }

  private createHistoricalDaySeries(
    start: number,
    end: number
  ): MhdChartPoint[] {
    const points: MhdChartPoint[] = [];
    const step = 30 * 60 * 1000;
    const totalSteps = Math.floor((end - start) / step);

    for (let index = 0; index <= totalSteps; index++) {
      const x = start + index * step;
      const progress = index / totalSteps;

      const base =
        35000 +
        Math.sin(progress * Math.PI * 1.2 - 1.2) * 45000 +
        Math.max(0, Math.sin(progress * Math.PI * 3.6)) * 65000 +
        Math.max(0, Math.sin(progress * Math.PI * 10.5)) * 18000;

      const y = Math.max(5000, Math.round(base + 45000));

      points.push({ x, y });
    }

    return points;
  }

  private createCurrentDaySeries(start: number, now: number): MhdChartPoint[] {
    const points: MhdChartPoint[] = [];
    const step = 15 * 60 * 1000;
    const totalSteps = Math.floor((now - start) / step);

    for (let index = 0; index <= totalSteps; index++) {
      const x = start + index * step;
      const progress = index / Math.max(1, totalSteps);

      const base =
        4000 +
        Math.sin(progress * Math.PI * 2.6 - 0.9) * 12000 +
        Math.max(0, Math.sin(progress * Math.PI * 4.5)) * 90000 +
        Math.max(0, Math.sin(progress * Math.PI * 11.5)) * 26000;

      const spike = index === Math.floor(totalSteps * 0.88) ? 110000 : 0;

      const y = Math.max(2000, Math.round(base + spike));

      points.push({ x, y });
    }

    return points;
  }

  private formatHour(timestamp: number): string {
    const date = new Date(timestamp);
    const hours = `${date.getUTCHours()}`.padStart(2, '0');
    const minutes = `${date.getUTCMinutes()}`.padStart(2, '0');

    if (minutes === '00') {
      return `${hours}:00`;
    }

    return `${hours}:${minutes}`;
  }
}
