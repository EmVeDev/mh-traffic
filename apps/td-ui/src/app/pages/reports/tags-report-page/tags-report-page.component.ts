import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { MhdIconComponent } from '@mh-traffic/mh-design';
import {
  ReportTableColumn,
  ReportTableComponent,
  ReportTableDistributionSegment,
  ReportTableRow,
  ReportTableTotalsRow,
} from '../../../features/report-table/report-table.component';
import {
  ReportOverviewComponent,
  ReportOverviewGroup,
} from '../../../features/report-overview/report-overview.component';
import {
  ReportToolbarComponent,
  ReportToolbarToken,
} from '../../../features/report-toolbar/report-toolbar.component';
import { ReportPageHeaderComponent } from '../../../features/report-page-header/report-page-header.component';

interface TagsTableRowSource {
  name: string;
  articles: number;
  pageviews: number;
  www: number;
  newsApp: number;
  digiPaperApp: number;
}

@Component({
  selector: 'td-tags-report-page',
  standalone: true,
  imports: [
    MhdIconComponent,
    ReportTableComponent,
    ReportOverviewComponent,
    ReportToolbarComponent,
    ReportPageHeaderComponent,
  ],
  templateUrl: './tags-report-page.component.html',
  styleUrl: './tags-report-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsReportPageComponent {
  readonly siteLabel = signal('nieuwsblad.be');
  readonly analysisTypeLabel = signal('Single-day');
  readonly selectedDateLabel = signal('05/11/2025');

  readonly metricLabel = signal('pageviews');
  readonly breakdownLabel = signal('applications');

  readonly toolbarTokens = computed<ReportToolbarToken[]>(() => [
    { label: this.analysisTypeLabel() },
    { label: this.metricLabel() },
    { label: this.breakdownLabel() },
  ]);

  readonly valueDisplayMode = signal<'raw' | 'percentage'>('raw');
  readonly tableDisplayMode = signal<'chart' | 'table'>('table');

  readonly tableColumns = computed<ReportTableColumn[]>(() => {
    if (this.tableDisplayMode() === 'chart') {
      return [
        { key: 'articles', label: 'articles', align: 'right' },
        { key: 'pageviews', label: 'pageviews', align: 'right' },
      ];
    }

    return [
      { key: 'articles', label: 'articles', align: 'right' },
      { key: 'pageviews', label: 'pageviews', align: 'right' },
      { key: 'www', label: 'www', align: 'right' },
      { key: 'newsApp', label: 'news-app', align: 'right' },
      { key: 'digiPaperApp', label: 'digipaper-app', align: 'right' },
    ];
  });

  readonly rows = signal<TagsTableRowSource[]>([
    {
      name: 'politiek',
      articles: 676,
      pageviews: 218579,
      www: 97581,
      newsApp: 119587,
      digiPaperApp: 1411,
    },
    {
      name: 'lokale fd',
      articles: 884,
      pageviews: 211161,
      www: 115843,
      newsApp: 94687,
      digiPaperApp: 631,
    },
    {
      name: 'werkloosheid',
      articles: 800,
      pageviews: 136581,
      www: 98967,
      newsApp: 37614,
      digiPaperApp: 0,
    },
    {
      name: 'weer',
      articles: 1767,
      pageviews: 111822,
      www: 53442,
      newsApp: 58380,
      digiPaperApp: 0,
    },
    {
      name: 'play',
      articles: 1244,
      pageviews: 102705,
      www: 54501,
      newsApp: 48204,
      digiPaperApp: 0,
    },
  ]);

  readonly overviewLeftGroups = computed<ReportOverviewGroup[]>(() => [
    {
      title: 'Reach',
      icon: 'fa-rocket',
      sections: [
        {
          metrics: [
            {
              label: 'TOTAL READS',
              value: '2 357 411',
              delta: '+2,86%',
              deltaTone: 'positive',
            },
            {
              label: 'TOTAL PAGEVIEWS',
              value: '3 371 182',
              delta: '-1,86%',
              deltaTone: 'negative',
            },
          ],
        },
      ],
    },
    {
      title: 'Conversions',
      icon: 'fa-cart-shopping',
      sections: [
        {
          metrics: [
            {
              label: 'TOTAL PURCHASES',
              value: '23',
            },
            {
              label: 'TOTAL REGISTRATIONS',
              value: '128',
            },
          ],
        },
      ],
    },
  ]);

  readonly overviewRightGroups = computed<ReportOverviewGroup[]>(() => [
    {
      title: 'Engagement',
      icon: 'fa-users',
      sections: [
        {
          metrics: [
            {
              label: 'SUBSCRIBER ATT. TIME',
              value: '1 662 239 min',
              delta: '+2,86%',
              deltaTone: 'positive',
            },
            {
              label: 'ATTENTION TIME',
              value: '2 784 462 min',
              delta: '+2,86%',
              deltaTone: 'positive',
            },
          ],
        },
        {
          qualityItems: [
            {
              label: 'Bouncers',
              value: '15%',
              fillPercent: 15,
              tone: 'red',
            },
            {
              label: 'Scanners',
              value: '60%',
              fillPercent: 60,
              tone: 'yellow',
            },
            {
              label: 'Deeply reads',
              value: '25%',
              fillPercent: 25,
              tone: 'green',
            },
          ],
        },
      ],
    },
  ]);

  readonly tableRows = computed<ReportTableRow[]>(() =>
    this.rows().map((row) => {
      const distribution = this.buildDistribution(
        row.www,
        row.newsApp,
        row.digiPaperApp
      );

      return {
        name: row.name,
        link: `/content/tags/${this.toSlug(row.name)}`,
        values: {
          articles: this.formatNumber(row.articles),
          pageviews: this.formatNumber(row.pageviews),
          www:
            this.valueDisplayMode() === 'raw'
              ? this.formatNumber(row.www)
              : distribution[0].percentageLabel,
          newsApp:
            this.valueDisplayMode() === 'raw'
              ? this.formatNumber(row.newsApp)
              : distribution[1].percentageLabel,
          digiPaperApp:
            this.valueDisplayMode() === 'raw'
              ? this.formatNumber(row.digiPaperApp)
              : distribution[2].percentageLabel,
        },
        distributionSegments: distribution,
      };
    })
  );

  readonly tableTotals = computed<ReportTableTotalsRow>(() => {
    const rows = this.rows();

    const articles = rows.reduce((sum, row) => sum + row.articles, 0);
    const pageviews = rows.reduce((sum, row) => sum + row.pageviews, 0);
    const www = rows.reduce((sum, row) => sum + row.www, 0);
    const newsApp = rows.reduce((sum, row) => sum + row.newsApp, 0);
    const digiPaperApp = rows.reduce((sum, row) => sum + row.digiPaperApp, 0);

    const distribution = this.buildDistribution(www, newsApp, digiPaperApp);

    return {
      name: 'Totals',
      values: {
        articles: this.formatNumber(articles),
        pageviews: this.formatNumber(pageviews),
        www:
          this.valueDisplayMode() === 'raw'
            ? this.formatNumber(www)
            : distribution[0].percentageLabel,
        newsApp:
          this.valueDisplayMode() === 'raw'
            ? this.formatNumber(newsApp)
            : distribution[1].percentageLabel,
        digiPaperApp:
          this.valueDisplayMode() === 'raw'
            ? this.formatNumber(digiPaperApp)
            : distribution[2].percentageLabel,
      },
      distributionSegments: distribution,
    };
  });

  setValueDisplayMode(mode: 'raw' | 'percentage'): void {
    this.valueDisplayMode.set(mode);
  }

  setTableDisplayMode(mode: 'chart' | 'table'): void {
    this.tableDisplayMode.set(mode);
  }

  private buildDistribution(
    www: number,
    newsApp: number,
    digiPaperApp: number
  ): ReportTableDistributionSegment[] {
    const total = www + newsApp + digiPaperApp;

    const wwwPct = total > 0 ? (www / total) * 100 : 0;
    const newsAppPct = total > 0 ? (newsApp / total) * 100 : 0;
    const digiPaperPct = total > 0 ? (digiPaperApp / total) * 100 : 0;

    return [
      {
        label: 'www',
        shortLabel: 'www',
        valueLabel: this.formatNumber(www),
        percentageLabel: this.formatPercent(wwwPct),
        percentage: wwwPct,
        colorClass: 'distribution-segment--www',
        tooltip: this.buildTooltip('www', www, wwwPct),
      },
      {
        label: 'news-app',
        shortLabel: 'news-app',
        valueLabel: this.formatNumber(newsApp),
        percentageLabel: this.formatPercent(newsAppPct),
        percentage: newsAppPct,
        colorClass: 'distribution-segment--news-app',
        tooltip: this.buildTooltip('news-app', newsApp, newsAppPct),
      },
      {
        label: 'digipaper-app',
        shortLabel: 'digipaper',
        valueLabel: this.formatNumber(digiPaperApp),
        percentageLabel: this.formatPercent(digiPaperPct),
        percentage: digiPaperPct,
        colorClass: 'distribution-segment--digi-paper',
        tooltip: this.buildTooltip('digipaper-app', digiPaperApp, digiPaperPct),
      },
    ];
  }

  private toSlug(value: string): string {
    return value.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-');
  }

  private formatNumber(value: number): string {
    return new Intl.NumberFormat('nl-BE').format(value);
  }

  private formatPercent(value: number): string {
    return `${Math.round(value)}%`;
  }

  private buildTooltip(
    label: string,
    value: number,
    percentage: number
  ): string {
    return `${label} ${this.formatNumber(value)} (${this.formatPercent(
      percentage
    )})`;
  }
}
