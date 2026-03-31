import { computed, Injectable } from '@angular/core';
import type {
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

  private formatNumber(value: number): string {
    return new Intl.NumberFormat('nl-BE').format(value);
  }

  private formatPercent(value: number, total: number): string {
    if (total <= 0) {
      return '0%';
    }

    return `${Math.round((value / total) * 100)}%`;
  }
}
