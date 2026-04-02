import { computed, inject, Injectable } from '@angular/core';
import type { MhdChartConfig, MhdChartPoint } from '@mh-traffic/mh-design';
import { createReportBaseStore } from '../shared/create-report-base-store';
import {
  createGenericOverviewLeftGroups,
  createGenericOverviewRightGroups,
  createSimpleTotals,
  mapSimpleRowToReportRow,
} from '../shared/simple-report-page-helpers';
import {
  SECTION_DETAIL_TABLE_COLUMNS,
  TAG_REPORT_CHART_COLUMNS,
} from '../shared/report-table-columns';
import {
  createArticlesBreakdownOptions,
  createSimpleMetricOptions,
} from '../shared/report-filter-options';
import { SectionDetailPageDataStore } from './section-detail-page.data-store';

@Injectable()
export class SectionDetailPageStore {
  private readonly data = inject(SectionDetailPageDataStore);

  readonly base = createReportBaseStore();

  readonly title = 'Section detail';
  readonly overviewTitle = computed(() => {
    const metric = this.base.selectedMetricValue();
    return `How articles in this section generate <strong>${metric}</strong>`;
  });

  readonly tableTitle = 'Top articles in this section';
  readonly firstColumnHeader = 'Article';

  readonly tableColumns = computed(() =>
    this.base.tableDisplayMode() === 'chart'
      ? [...TAG_REPORT_CHART_COLUMNS]
      : [...SECTION_DETAIL_TABLE_COLUMNS]
  );

  readonly overviewLeftGroups = computed(() =>
    createGenericOverviewLeftGroups()
  );

  readonly overviewRightGroups = computed(() =>
    createGenericOverviewRightGroups()
  );

  readonly overviewChart = computed<MhdChartConfig>(() => {
    const start = Date.UTC(2026, 2, 31, 0, 0, 0, 0);
    const end = Date.UTC(2026, 2, 31, 23, 59, 0, 0);
    const now = Date.UTC(2026, 2, 31, 16, 0, 0, 0);

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
          id: 'news',
          label: 'News',
          color: '#14b86e',
          data: this.createCurrentSectionSeries(start, now, 1, 1.2),
        },
        {
          id: 'sport',
          label: 'Sport',
          color: '#b71234',
          data: this.createCurrentSectionSeries(start, now, 0.72, 0.95),
        },
        {
          id: 'lifestyle',
          label: 'Lifestyle',
          color: '#f2b600',
          data: this.createCurrentSectionSeries(start, now, 0.58, 0.82),
        },
        {
          id: 'culture',
          label: 'Culture',
          color: '#234fbe',
          data: this.createCurrentSectionSeries(start, now, 0.42, 0.68),
        },
      ],
    };
  });

  readonly tableRows = computed(() =>
    this.data
      .rows()
      .map((row) =>
        mapSimpleRowToReportRow(
          row,
          this.base.valueDisplayMode(),
          '/content/articles'
        )
      )
  );

  readonly tableTotals = computed(() =>
    createSimpleTotals(this.data.rows(), this.base.valueDisplayMode())
  );

  constructor() {
    this.base.metricOptions.set(createSimpleMetricOptions());
    this.base.selectedMetricValue.set('pageviews');

    this.base.breakdownOptions.set(createArticlesBreakdownOptions());
    this.base.selectedBreakdownValue.set('articles');

    this.base.tableDisplayMode.set('table');
    this.base.valueDisplayMode.set('raw');
  }

  private createHistoricalSectionSeries(
    start: number,
    end: number
  ): MhdChartPoint[] {
    const points: MhdChartPoint[] = [];
    const step = 30 * 60 * 1000;
    const totalSteps = Math.floor((end - start) / step);

    for (let index = 0; index <= totalSteps; index++) {
      const x = start + index * step;
      const progress = index / Math.max(1, totalSteps);

      const baseline = 30000;
      const morningRise =
        Math.max(0, Math.sin(progress * Math.PI * 1.35 - 0.9)) * 65000;
      const middayPlateau =
        Math.max(0, Math.sin(progress * Math.PI * 3.1 + 0.15)) * 42000;
      const afternoonNoise =
        Math.max(0, Math.sin(progress * Math.PI * 12.2 - 0.4)) * 14000;

      const y = Math.round(
        baseline + morningRise + middayPlateau + afternoonNoise
      );

      points.push({ x, y });
    }

    return points;
  }

  private createCurrentSectionSeries(
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

      const primaryWave =
        Math.max(0, Math.sin(progress * Math.PI * 2.75 - 1.05)) *
        26000 *
        amplitudeFactor;
      const secondaryWave =
        Math.max(0, Math.sin(progress * Math.PI * 5.9 + 0.35)) *
        9000 *
        amplitudeFactor;
      const fineNoise =
        Math.max(0, Math.sin(progress * Math.PI * 13.6 - 0.2)) *
        4200 *
        amplitudeFactor;

      const baseline = 2500 + 8500 * baseFactor;
      const spike =
        index === Math.floor(totalSteps * 0.9) ? 28000 * amplitudeFactor : 0;

      const y = Math.round(
        baseline + primaryWave + secondaryWave + fineNoise + spike
      );

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
