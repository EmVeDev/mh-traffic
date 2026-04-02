import { computed, Injectable } from '@angular/core';
import type {
  MhdChartConfig,
  MhdChartPoint,
  ReportTableColumn,
  ReportTableDistributionSegment,
  ReportTableRow,
} from '@mh-traffic/mh-design';
import { createReportBaseStore } from '../shared/create-report-base-store';
import {
  createTagReportOverviewLeftGroups,
  createTagReportOverviewRightGroups,
} from '../shared/report-overview-factories';
import {
  createApplicationsBreakdownOptions,
  createPrimaryReportMetricOptions,
} from '../shared/report-filter-options';

interface TagRowSource {
  id: string;
  name: string;
  articles: number;
  pageviews: number;
  www: number;
  newsApp: number;
  digiPaperApp: number;
}

@Injectable()
export class TagsReportPageStore {
  readonly base = createReportBaseStore();

  readonly title = 'Tags report';

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

  readonly firstColumnHeader = 'Top 30 tags';

  private readonly sourceRows: TagRowSource[] = [
    {
      id: 'politiek',
      name: 'politiek',
      articles: 676,
      pageviews: 218579,
      www: 97581,
      newsApp: 119587,
      digiPaperApp: 1411,
    },
    {
      id: 'lokale-fd',
      name: 'lokale fd',
      articles: 884,
      pageviews: 211161,
      www: 115843,
      newsApp: 94687,
      digiPaperApp: 631,
    },
    {
      id: 'werkloosheid',
      name: 'werkloosheid',
      articles: 800,
      pageviews: 136581,
      www: 98967,
      newsApp: 37614,
      digiPaperApp: 0,
    },
    {
      id: 'weer',
      name: 'weer',
      articles: 1767,
      pageviews: 111822,
      www: 53442,
      newsApp: 58380,
      digiPaperApp: 0,
    },
    {
      id: 'play',
      name: 'play',
      articles: 1244,
      pageviews: 102705,
      www: 54501,
      newsApp: 48204,
      digiPaperApp: 0,
    },
  ];

  readonly overviewLeftGroups = computed(() =>
    createTagReportOverviewLeftGroups()
  );

  readonly overviewRightGroups = computed(() =>
    createTagReportOverviewRightGroups()
  );

  readonly overviewChart = computed<MhdChartConfig>(() => {
    const start = Date.UTC(2026, 2, 31, 0, 0, 0, 0);
    const end = Date.UTC(2026, 2, 31, 23, 59, 0, 0);
    const now = Date.UTC(2026, 2, 31, 15, 15, 0, 0);

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
          id: 'politiek',
          label: 'politiek',
          color: '#14b86e',
          data: this.createCurrentTagsSeries(start, now, 1, 1.1),
        },
        {
          id: 'lokale-fd',
          label: 'lokale fd',
          color: '#b71234',
          data: this.createCurrentTagsSeries(start, now, 0.82, 0.96),
        },
        {
          id: 'werkloosheid',
          label: 'werkloosheid',
          color: '#f2b600',
          data: this.createCurrentTagsSeries(start, now, 0.64, 0.84),
        },
        {
          id: 'weer',
          label: 'weer',
          color: '#234fbe',
          data: this.createCurrentTagsSeries(start, now, 0.52, 0.74),
        },
        {
          id: 'play',
          label: 'play',
          color: '#0b6b4b',
          data: this.createCurrentTagsSeries(start, now, 0.44, 0.66),
        },
      ],
    };
  });

  readonly tableColumns = computed<ReportTableColumn[]>(() => {
    if (this.base.tableDisplayMode() === 'chart') {
      return [
        {
          key: 'articles',
          label: 'articles',
          align: 'right',
          type: 'number',
          sortable: true,
        },
        {
          key: 'pageviews',
          label: 'pageviews',
          align: 'right',
          type: 'number',
          sortable: true,
        },
      ];
    }

    return [
      {
        key: 'articles',
        label: 'articles',
        align: 'right',
        type: 'number',
        sortable: true,
      },
      {
        key: 'pageviews',
        label: 'pageviews',
        align: 'right',
        type: 'number',
        sortable: true,
      },
      {
        key: 'www',
        label: 'www',
        align: 'right',
        sortable: true,
      },
      {
        key: 'newsApp',
        label: 'news-app',
        align: 'right',
        sortable: true,
      },
      {
        key: 'digiPaperApp',
        label: 'digipaper-app',
        align: 'right',
        sortable: true,
      },
    ];
  });

  readonly tableRows = computed(() =>
    this.sourceRows.map((row) => this.mapRow(row))
  );

  readonly tableTotals = computed(() => null);

  constructor() {
    this.base.metricOptions.set(createPrimaryReportMetricOptions());
    this.base.selectedMetricValue.set('pageviews');

    this.base.breakdownOptions.set(createApplicationsBreakdownOptions());
    this.base.selectedBreakdownValue.set('applications');

    this.base.tableDisplayMode.set('table');
    this.base.valueDisplayMode.set('raw');
  }

  private mapRow(row: TagRowSource): ReportTableRow {
    return {
      id: row.id,
      name: row.name,
      link: `/content/tags/${row.id}`,
      values: {
        articles: row.articles,
        pageviews: row.pageviews,
        www: this.displayAppValue(row.www, row.pageviews),
        newsApp: this.displayAppValue(row.newsApp, row.pageviews),
        digiPaperApp: this.displayAppValue(row.digiPaperApp, row.pageviews),
      },
      distributionSegments: this.buildDistributionSegments(row),
    };
  }

  private displayAppValue(value: number, total: number): number | string {
    if (this.base.valueDisplayMode() === 'raw') {
      return value;
    }

    return this.formatPercent(value, total);
  }

  private buildDistributionSegments(
    row: TagRowSource
  ): ReportTableDistributionSegment[] {
    return [
      this.createSegment(
        'www',
        'www',
        'www',
        row.www,
        row.pageviews,
        '#43b2ff'
      ),
      this.createSegment(
        'newsApp',
        'news-app',
        'news-app',
        row.newsApp,
        row.pageviews,
        '#ef6a59'
      ),
      this.createSegment(
        'digiPaperApp',
        'digipaper-app',
        'digipaper',
        row.digiPaperApp,
        row.pageviews,
        '#f2c94c'
      ),
    ];
  }

  private createSegment(
    key: string,
    label: string,
    shortLabel: string,
    value: number,
    total: number,
    color: string
  ): ReportTableDistributionSegment {
    return {
      key,
      label,
      shortLabel,
      value,
      valueLabel: this.formatNumber(value),
      percentageLabel: this.formatPercent(value, total),
      percentage: total > 0 ? (value / total) * 100 : 0,
      tooltip: `${label} ${this.formatNumber(value)} (${this.formatPercent(
        value,
        total
      )})`,
      color,
    };
  }

  private createHistoricalTagsSeries(
    start: number,
    end: number
  ): MhdChartPoint[] {
    const points: MhdChartPoint[] = [];
    const step = 30 * 60 * 1000;
    const totalSteps = Math.floor((end - start) / step);

    for (let index = 0; index <= totalSteps; index++) {
      const x = start + index * step;
      const progress = index / Math.max(1, totalSteps);

      const baseline = 22000;
      const morningLift =
        Math.max(0, Math.sin(progress * Math.PI * 1.28 - 0.98)) * 52000;
      const middayBody =
        Math.max(0, Math.sin(progress * Math.PI * 3.15 + 0.12)) * 34000;
      const detail =
        Math.max(0, Math.sin(progress * Math.PI * 12.6 - 0.24)) * 12000;

      const y = Math.round(baseline + morningLift + middayBody + detail);

      points.push({ x, y });
    }

    return points;
  }

  private createCurrentTagsSeries(
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
        Math.max(0, Math.sin(progress * Math.PI * 2.82 - 1.06)) *
        22500 *
        amplitudeFactor;
      const secondary =
        Math.max(0, Math.sin(progress * Math.PI * 6.05 + 0.3)) *
        7600 *
        amplitudeFactor;
      const fineNoise =
        Math.max(0, Math.sin(progress * Math.PI * 13.3 - 0.18)) *
        3200 *
        amplitudeFactor;

      const baseline = 2600 + 7200 * baseFactor;
      const spike =
        index === Math.floor(totalSteps * 0.88) ? 24000 * amplitudeFactor : 0;

      const y = Math.round(baseline + primary + secondary + fineNoise + spike);

      points.push({ x, y });
    }

    return points;
  }

  private formatNumber(value: number): string {
    return new Intl.NumberFormat('nl-BE').format(value);
  }

  private formatPercent(value: number, total: number): string {
    if (total <= 0) {
      return '0%';
    }

    return `${Math.round((value / total) * 100)}%`;
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
