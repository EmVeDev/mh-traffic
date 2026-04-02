import { computed, Injectable } from '@angular/core';
import type {
  MhdChartConfig,
  MhdChartPoint,
  ReportTableColumn,
  ReportTableRow,
} from '@mh-traffic/mh-design';
import { createReportBaseStore } from '../shared/create-report-base-store';
import {
  createGenericOverviewLeftGroups,
  createGenericOverviewRightGroups,
} from '../shared/simple-report-page-helpers';
import {
  createReferrersBreakdownOptions,
  createSimpleMetricOptions,
} from '../shared/report-filter-options';

@Injectable()
export class ReferrersReportPageStore {
  readonly base = createReportBaseStore();

  readonly title = 'Referrers report';
  readonly overviewTitle =
    'How articles in <strong>referrers</strong> generate <strong>pageviews</strong>';
  readonly tableTitle =
    'How do <strong>referrers</strong> differ when broken down by <strong>main metrics</strong>';
  readonly firstColumnHeader = 'Referrers';

  readonly overviewLeftGroups = computed(() =>
    createGenericOverviewLeftGroups()
  );

  readonly overviewRightGroups = computed(() =>
    createGenericOverviewRightGroups()
  );

  readonly overviewChart = computed<MhdChartConfig>(() => {
    const start = Date.UTC(2026, 2, 31, 0, 0, 0, 0);
    const end = Date.UTC(2026, 2, 31, 23, 59, 0, 0);
    const now = Date.UTC(2026, 2, 31, 14, 30, 0, 0);

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
          id: 'internal-article',
          label: 'Internal - article',
          color: '#14b86e',
          data: this.createCurrentSeries(start, now, 0.95, 1.25),
        },
        {
          id: 'direct',
          label: 'Direct',
          color: '#b71234',
          data: this.createCurrentSeries(start, now, 0.68, 0.92),
        },
        {
          id: 'google',
          label: 'Google',
          color: '#f2b600',
          data: this.createCurrentSeries(start, now, 0.52, 0.84),
        },
        {
          id: 'facebook',
          label: 'Facebook',
          color: '#234fbe',
          data: this.createCurrentSeries(start, now, 0.38, 0.7),
        },
        {
          id: 'push',
          label: 'Push',
          color: '#0b6b4b',
          data: this.createCurrentSeries(start, now, 0.22, 0.5),
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
      key: 'subscriber',
      label: 'Subscriber',
      align: 'right',
      type: 'number',
    },
    {
      key: 'registered',
      label: 'Registered',
      align: 'right',
      type: 'number',
    },
    {
      key: 'anonymous',
      label: 'Anonymous',
      align: 'right',
      type: 'number',
    },
  ]);

  readonly tableRows = computed<ReportTableRow[]>(() => [
    {
      id: 'internal-article',
      name: 'Internal - article',
      link: '/content/referrers/internal-article',
      values: {
        pageviews: 850987,
        subscriber: 509979,
        registered: 55418,
        anonymous: 285590,
      },
    },
    {
      id: 'internal-home',
      name: 'Internal - home',
      link: '/content/referrers/internal-home',
      values: {
        pageviews: 794090,
        subscriber: 468321,
        registered: 54746,
        anonymous: 271023,
      },
    },
    {
      id: 'google-discover',
      name: 'Google Discover',
      link: '/content/referrers/google-discover',
      values: {
        pageviews: 380169,
        subscriber: 41407,
        registered: 25503,
        anonymous: 313259,
      },
    },
    {
      id: 'newsletters',
      name: 'Newsletters',
      link: '/content/referrers/newsletters',
      values: {
        pageviews: 358896,
        subscriber: 140583,
        registered: 40373,
        anonymous: 177940,
      },
    },
    {
      id: 'facebook',
      name: 'Facebook',
      link: '/content/referrers/facebook',
      values: {
        pageviews: 238704,
        subscriber: 21719,
        registered: 12402,
        anonymous: 204583,
      },
    },
  ]);

  readonly tableTotals = computed(() => null);

  constructor() {
    this.base.metricOptions.set(createSimpleMetricOptions());
    this.base.selectedMetricValue.set('pageviews');

    this.base.breakdownOptions.set(createReferrersBreakdownOptions());
    this.base.selectedBreakdownValue.set('referrers');

    this.base.tableDisplayMode.set('table');
    this.base.valueDisplayMode.set('raw');
  }

  private createHistoricalTotalSeries(
    start: number,
    end: number
  ): MhdChartPoint[] {
    const points: MhdChartPoint[] = [];
    const step = 30 * 60 * 1000;
    const totalSteps = Math.floor((end - start) / step);

    for (let index = 0; index <= totalSteps; index++) {
      const x = start + index * step;
      const progress = index / Math.max(1, totalSteps);

      const morningDrop =
        Math.max(0, Math.sin(progress * Math.PI * 1.2 + 2.4)) * 80000;
      const middayLift =
        Math.max(0, Math.sin(progress * Math.PI * 2.1 - 0.8)) * 120000;
      const afternoonNoise =
        Math.max(0, Math.sin(progress * Math.PI * 11.5)) * 25000;

      const y = Math.round(45000 + morningDrop + middayLift + afternoonNoise);

      points.push({ x, y });
    }

    return points;
  }

  private createCurrentSeries(
    start: number,
    now: number,
    amplitudeFactor: number,
    baseFactor: number
  ): MhdChartPoint[] {
    const points: MhdChartPoint[] = [];
    const step = 15 * 60 * 1000;
    const totalSteps = Math.floor((now - start) / step);

    for (let index = 0; index <= totalSteps; index++) {
      const x = start + index * step;
      const progress = index / Math.max(1, totalSteps);

      const shape =
        Math.max(0, Math.sin(progress * Math.PI * 2.8 - 1.15)) *
          36000 *
          amplitudeFactor +
        Math.max(0, Math.sin(progress * Math.PI * 6.2 + 0.25)) *
          12000 *
          amplitudeFactor +
        Math.max(0, Math.sin(progress * Math.PI * 12.8 - 0.35)) *
          6500 *
          amplitudeFactor;

      const baseline = 3500 + 9000 * baseFactor;
      const spike =
        index === Math.floor(totalSteps * 0.88) ? 42000 * amplitudeFactor : 0;

      const y = Math.round(baseline + shape + spike);

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
