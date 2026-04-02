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
  TAG_DETAIL_TABLE_COLUMNS,
  TAG_REPORT_CHART_COLUMNS,
} from '../shared/report-table-columns';
import {
  createArticlesBreakdownOptions,
  createSimpleMetricOptions,
} from '../shared/report-filter-options';
import { TagDetailPageDataStore } from './tag-detail-page.data-store';

@Injectable()
export class TagDetailPageStore {
  private readonly data = inject(TagDetailPageDataStore);

  readonly base = createReportBaseStore();

  readonly title = 'Tag detail';
  readonly overviewTitle = computed(() => {
    const metric = this.base.selectedMetricValue();
    return `How articles in this tag generate <strong>${metric}</strong>`;
  });

  readonly tableTitle = 'Top articles in this tag';
  readonly firstColumnHeader = 'Article';

  readonly tableColumns = computed(() =>
    this.base.tableDisplayMode() === 'chart'
      ? [...TAG_REPORT_CHART_COLUMNS]
      : [...TAG_DETAIL_TABLE_COLUMNS]
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
    const now = Date.UTC(2026, 2, 31, 15, 45, 0, 0);

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
          color: '#d3d3d3',
          comparison: true,
          data: this.createHistoricalTagSeries(start, end),
        },
        {
          id: 'current-tag',
          label: 'Current tag',
          color: '#15b8ff',
          data: this.createCurrentTagSeries(start, now),
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
          '/content/tags'
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
  }

  private createHistoricalTagSeries(
    start: number,
    end: number
  ): MhdChartPoint[] {
    const points: MhdChartPoint[] = [];
    const step = 30 * 60 * 1000;
    const totalSteps = Math.floor((end - start) / step);

    for (let index = 0; index <= totalSteps; index++) {
      const x = start + index * step;
      const progress = index / Math.max(1, totalSteps);

      const baseline = 18000;
      const morningLift =
        Math.max(0, Math.sin(progress * Math.PI * 1.32 - 1.05)) * 42000;
      const middayBody =
        Math.max(0, Math.sin(progress * Math.PI * 3.25 + 0.18)) * 30000;
      const fineNoise =
        Math.max(0, Math.sin(progress * Math.PI * 12.8 - 0.35)) * 9000;

      const y = Math.round(baseline + morningLift + middayBody + fineNoise);

      points.push({ x, y });
    }

    return points;
  }

  private createCurrentTagSeries(start: number, now: number): MhdChartPoint[] {
    const points: MhdChartPoint[] = [];
    const step = 15 * 60 * 1000;
    const totalSteps = Math.floor((now - start) / step);

    for (let index = 0; index <= totalSteps; index++) {
      const x = start + index * step;
      const progress = index / Math.max(1, totalSteps);

      const primary =
        Math.max(0, Math.sin(progress * Math.PI * 2.95 - 1.1)) * 27000;
      const secondary =
        Math.max(0, Math.sin(progress * Math.PI * 6.1 + 0.22)) * 8500;
      const detail =
        Math.max(0, Math.sin(progress * Math.PI * 13.4 - 0.16)) * 3500;
      const spike = index === Math.floor(totalSteps * 0.87) ? 30000 : 0;

      const y = Math.round(4200 + primary + secondary + detail + spike);

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
