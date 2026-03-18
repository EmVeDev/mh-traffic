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

interface ReferrerTableRowSource {
  name: string;
  pageviews: number;
  subscriber: number;
  registered: number;
  anonymous: number;
}

@Component({
  selector: 'td-referrers-report-page',
  standalone: true,
  imports: [
    MhdIconComponent,
    ReportPageHeaderComponent,
    ReportToolbarComponent,
    ReportOverviewComponent,
    ReportTableComponent,
  ],
  templateUrl: './referrers-report-page.component.html',
  styleUrl: './referrers-report-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferrersReportPageComponent {
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
              label: 'READS',
              value: '2 357 411',
              delta: '+2,86%',
              deltaTone: 'positive',
            },
            {
              label: 'PAGEVIEWS',
              value: '3 371 182',
              delta: '-1,86%',
              deltaTone: 'negative',
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
    { key: 'subscriber', label: 'Subscriber', align: 'right' },
    { key: 'registered', label: 'Registered', align: 'right' },
    { key: 'anonymous', label: 'Anonymous', align: 'right' },
  ]);

  readonly rows = signal<ReferrerTableRowSource[]>([
    {
      name: 'Internal - article',
      pageviews: 850987,
      subscriber: 509979,
      registered: 55418,
      anonymous: 285590,
    },
    {
      name: 'Internal - home',
      pageviews: 794090,
      subscriber: 468321,
      registered: 54746,
      anonymous: 271023,
    },
    {
      name: 'Google Discover',
      pageviews: 380169,
      subscriber: 41407,
      registered: 25503,
      anonymous: 313259,
    },
    {
      name: 'Newsletters',
      pageviews: 358896,
      subscriber: 140583,
      registered: 40373,
      anonymous: 177940,
    },
    {
      name: 'Facebook',
      pageviews: 238704,
      subscriber: 21719,
      registered: 12402,
      anonymous: 204583,
    },
    {
      name: 'Google',
      pageviews: 213920,
      subscriber: 177312,
      registered: 213920,
      anonymous: 177312,
    },
    {
      name: 'Push',
      pageviews: 180389,
      subscriber: 82563,
      registered: 18503,
      anonymous: 79323,
    },
    {
      name: 'Internal - other',
      pageviews: 148342,
      subscriber: 93400,
      registered: 10213,
      anonymous: 44729,
    },
    {
      name: 'Referral',
      pageviews: 55925,
      subscriber: 8964,
      registered: 3858,
      anonymous: 43103,
    },
    {
      name: 'Direct',
      pageviews: 55416,
      subscriber: 25693,
      registered: 9360,
      anonymous: 20363,
    },
  ]);

  readonly tableRows = computed<ReportTableRow[]>(() =>
    this.rows().map((row) => ({
      name: row.name,
      values: {
        pageviews: this.formatNumber(row.pageviews),
        subscriber: this.formatNumber(row.subscriber),
        registered: this.formatNumber(row.registered),
        anonymous: this.formatNumber(row.anonymous),
      },
    }))
  );

  readonly tableTotals = computed<ReportTableTotalsRow>(() => {
    const rows = this.rows();

    const pageviews = rows.reduce((sum, row) => sum + row.pageviews, 0);
    const subscriber = rows.reduce((sum, row) => sum + row.subscriber, 0);
    const registered = rows.reduce((sum, row) => sum + row.registered, 0);
    const anonymous = rows.reduce((sum, row) => sum + row.anonymous, 0);

    return {
      name: 'Totals',
      values: {
        pageviews: this.formatNumber(pageviews),
        subscriber: this.formatNumber(subscriber),
        registered: this.formatNumber(registered),
        anonymous: this.formatNumber(anonymous),
      },
    };
  });

  private formatNumber(value: number): string {
    return new Intl.NumberFormat('nl-BE').format(value);
  }
}
