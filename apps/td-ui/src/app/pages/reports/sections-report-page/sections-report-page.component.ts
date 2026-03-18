import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { MhdIconComponent } from '@mh-traffic/mh-design';
import { ReportPageHeaderComponent } from '../../../features/report-page-header/report-page-header.component';
import {
  ReportToolbarComponent,
  ReportToolbarToken,
} from '../../../features/report-toolbar/report-toolbar.component';
import {
  ReportOverviewComponent,
  ReportOverviewGroup,
} from '../../../features/report-overview/report-overview.component';
import {
  ReportTableColumn,
  ReportTableComponent,
  ReportTableRow,
  ReportTableTotalsRow,
} from '../../../features/report-table/report-table.component';

interface SectionsTableRowSource {
  name: string;
  pageviews: number;
  subscriberAttention: number;
  totalAttention: number;
  reads: number;
}

@Component({
  selector: 'td-sections-report-page',
  standalone: true,
  imports: [
    MhdIconComponent,
    ReportPageHeaderComponent,
    ReportToolbarComponent,
    ReportOverviewComponent,
    ReportTableComponent,
  ],
  templateUrl: './sections-report-page.component.html',
  styleUrl: './sections-report-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionsReportPageComponent {
  readonly siteLabel = signal('nieuwsblad.be');
  readonly analysisTypeLabel = signal('Single-day');
  readonly selectedDateLabel = signal('05/11/2025');

  readonly metricLabel = signal('pageviews');
  readonly breakdownLabel = signal('main metrics');

  readonly toolbarTokens = computed<ReportToolbarToken[]>(() => [
    { label: this.analysisTypeLabel() },
    { label: this.metricLabel() },
    { label: this.breakdownLabel() },
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

  readonly tableColumns = computed<ReportTableColumn[]>(() => [
    { key: 'pageviews', label: 'Pageviews', align: 'right' },
    {
      key: 'subscriberAttention',
      label: 'Subscriber Attention',
      align: 'right',
    },
    { key: 'totalAttention', label: 'Total Attention', align: 'right' },
    { key: 'reads', label: 'Reads', align: 'right' },
  ]);

  readonly rows = signal<SectionsTableRowSource[]>([
    {
      name: 'nb/binnenland',
      pageviews: 513070,
      subscriberAttention: 332802,
      totalAttention: 584293,
      reads: 740975,
    },
    {
      name: 'nb/politiek',
      pageviews: 236993,
      subscriberAttention: 195557,
      totalAttention: 341710,
      reads: 275961,
    },
    {
      name: 'nb/buitenland',
      pageviews: 224795,
      subscriberAttention: 123257,
      totalAttention: 232717,
      reads: 247970,
    },
    {
      name: 'nb/media-en-cultuur',
      pageviews: 185356,
      subscriberAttention: 142015,
      totalAttention: 273519,
      reads: 223994,
    },
    {
      name: 'nb/economie',
      pageviews: 66436,
      subscriberAttention: 95087,
      totalAttention: 123008,
      reads: 196796,
    },
  ]);

  readonly tableRows = computed<ReportTableRow[]>(() =>
    this.rows().map((row) => ({
      name: row.name,
      values: {
        pageviews: this.formatNumber(row.pageviews),
        subscriberAttention: `${this.formatNumber(
          row.subscriberAttention
        )} min`,
        totalAttention: `${this.formatNumber(row.totalAttention)} min`,
        reads: this.formatNumber(row.reads),
      },
    }))
  );

  readonly tableTotals = computed<ReportTableTotalsRow>(() => {
    const rows = this.rows();

    const pageviews = rows.reduce((sum, row) => sum + row.pageviews, 0);
    const subscriberAttention = rows.reduce(
      (sum, row) => sum + row.subscriberAttention,
      0
    );
    const totalAttention = rows.reduce(
      (sum, row) => sum + row.totalAttention,
      0
    );
    const reads = rows.reduce((sum, row) => sum + row.reads, 0);

    return {
      name: 'Totals',
      values: {
        pageviews: this.formatNumber(pageviews),
        subscriberAttention: `${this.formatNumber(subscriberAttention)} min`,
        totalAttention: `${this.formatNumber(totalAttention)} min`,
        reads: this.formatNumber(reads),
      },
    };
  });

  private formatNumber(value: number): string {
    return new Intl.NumberFormat('nl-BE').format(value);
  }
}
