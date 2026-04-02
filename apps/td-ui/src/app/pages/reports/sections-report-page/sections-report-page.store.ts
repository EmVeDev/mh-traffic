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
  createSectionsBreakdownOptions,
  createSimpleMetricOptions,
} from '../shared/report-filter-options';

@Injectable()
export class SectionsReportPageStore {
  readonly base = createReportBaseStore();

  readonly title = 'Sections report';

  readonly overviewTitle = computed(() => {
    const metric = this.base.selectedMetricValue();
    const breakdown = this.base.selectedBreakdownValue();
    return `How <strong>${breakdown}</strong> generate <strong>${metric}</strong>`;
  });

  readonly tableTitle = computed(() => {
    const metric = this.base.selectedMetricValue();
    const breakdown = this.base.selectedBreakdownValue();
    return `How do <strong>${breakdown}</strong> differ when broken down by <strong>${metric}</strong>`;
  });

  readonly firstColumnHeader = 'Top 30 sections';

  readonly overviewLeftGroups = computed(() =>
    createGenericOverviewLeftGroups()
  );

  readonly overviewRightGroups = computed(() =>
    createGenericOverviewRightGroups()
  );

  readonly overviewChart = computed<MhdChartConfig>(() => {
    const start = Date.UTC(2026, 2, 31, 0, 0, 0, 0);
    const end = Date.UTC(2026, 2, 31, 23, 59, 0, 0);
    const now = Date.UTC(2026, 2, 31, 15, 30, 0, 0);

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
        // {
        //   id: 'historical-average',
        //   label: 'Average past 4 weeks',
        //   color: '#d3d3d3',
        //   comparison: true,
        //   data: this.createHistoricalSectionsSeries(start, end),
        // },
        {
          id: 'nb-binnenland',
          label: 'nb/binnenland',
          color: '#14b86e',
          data: this.createCurrentSectionsSeries(start, now, 1, 1.18),
        },
        {
          id: 'nb-politiek',
          label: 'nb/politiek',
          color: '#b71234',
          data: this.createCurrentSectionsSeries(start, now, 0.76, 0.98),
        },
        {
          id: 'nb-buitenland',
          label: 'nb/buitenland',
          color: '#f2b600',
          data: this.createCurrentSectionsSeries(start, now, 0.62, 0.88),
        },
        {
          id: 'nb-media-en-cultuur',
          label: 'nb/media-en-cultuur',
          color: '#234fbe',
          data: this.createCurrentSectionsSeries(start, now, 0.5, 0.76),
        },
        {
          id: 'nb-economie',
          label: 'nb/economie',
          color: '#0b6b4b',
          data: this.createCurrentSectionsSeries(start, now, 0.36, 0.62),
        },
      ],
    };
  });

  readonly tableColumns = computed<ReportTableColumn[]>(() => [
    {
      key: 'reads',
      label: 'Reads',
      align: 'right',
      type: 'number',
    },
    {
      key: 'subscriberAttention',
      label: 'Subscriber Attention',
      align: 'right',
    },
    {
      key: 'totalAttention',
      label: 'Total Attention',
      align: 'right',
    },
    {
      key: 'pageviews',
      label: 'Pageviews',
      align: 'right',
      type: 'number',
    },
  ]);

  readonly tableRows = computed<ReportTableRow[]>(() => [
    {
      id: 'nb-binnenland',
      name: 'nb/binnenland',
      link: '/content/sections/nb-binnenland',
      values: {
        reads: 513070,
        subscriberAttention: '332 802 min',
        totalAttention: '584 293 min',
        pageviews: 740975,
      },
    },
    {
      id: 'nb-politiek',
      name: 'nb/politiek',
      link: '/content/sections/nb-politiek',
      values: {
        reads: 236993,
        subscriberAttention: '195 557 min',
        totalAttention: '341 710 min',
        pageviews: 275961,
      },
    },
    {
      id: 'nb-buitenland',
      name: 'nb/buitenland',
      link: '/content/sections/nb-buitenland',
      values: {
        reads: 224795,
        subscriberAttention: '123 257 min',
        totalAttention: '232 717 min',
        pageviews: 247970,
      },
    },
    {
      id: 'nb-media-en-cultuur',
      name: 'nb/media-en-cultuur',
      link: '/content/sections/nb-media-en-cultuur',
      values: {
        reads: 185356,
        subscriberAttention: '142 015 min',
        totalAttention: '273 519 min',
        pageviews: 223994,
      },
    },
    {
      id: 'nb-economie',
      name: 'nb/economie',
      link: '/content/sections/nb-economie',
      values: {
        reads: 66436,
        subscriberAttention: '95 087 min',
        totalAttention: '123 008 min',
        pageviews: 196796,
      },
    },
  ]);

  readonly tableTotals = computed(() => null);

  constructor() {
    this.base.metricOptions.set(createSimpleMetricOptions());
    this.base.selectedMetricValue.set('reads');

    this.base.breakdownOptions.set(createSectionsBreakdownOptions());
    this.base.selectedBreakdownValue.set('sections');

    this.base.tableDisplayMode.set('table');
    this.base.valueDisplayMode.set('raw');
  }

  private createHistoricalSectionsSeries(
    start: number,
    end: number
  ): MhdChartPoint[] {
    const points: MhdChartPoint[] = [];
    const step = 30 * 60 * 1000;
    const totalSteps = Math.floor((end - start) / step);

    for (let index = 0; index <= totalSteps; index++) {
      const x = start + index * step;
      const progress = index / Math.max(1, totalSteps);

      const baseline = 34000;
      const morningLift =
        Math.max(0, Math.sin(progress * Math.PI * 1.25 - 0.95)) * 72000;
      const middayBody =
        Math.max(0, Math.sin(progress * Math.PI * 3.05 + 0.05)) * 46000;
      const lateNoise =
        Math.max(0, Math.sin(progress * Math.PI * 12.4 - 0.3)) * 15000;

      const y = Math.round(baseline + morningLift + middayBody + lateNoise);

      points.push({ x, y });
    }

    return points;
  }

  private createCurrentSectionsSeries(
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

      const primary =
        Math.max(0, Math.sin(progress * Math.PI * 2.7 - 1.08)) *
        29500 *
        amplitudeFactor;
      const secondary =
        Math.max(0, Math.sin(progress * Math.PI * 5.8 + 0.28)) *
        9800 *
        amplitudeFactor;
      const detail =
        Math.max(0, Math.sin(progress * Math.PI * 13.1 - 0.22)) *
        4300 *
        amplitudeFactor;

      const baseline = 2800 + 9000 * baseFactor;
      const spike =
        index === Math.floor(totalSteps * 0.89) ? 32000 * amplitudeFactor : 0;

      const y = Math.round(baseline + primary + secondary + detail + spike);

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
