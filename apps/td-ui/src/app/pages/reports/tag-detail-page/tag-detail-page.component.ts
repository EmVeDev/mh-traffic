import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MhdIconComponent } from '@mh-traffic/mh-design';
import { ReportSubpageHeaderComponent } from '../../../features/report-subpage-header/report-subpage-header.component';
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

interface TagArticleRowSource {
  name: string;
  pageviews: number;
  subscriberAttention: number;
  totalAttention: number;
  reads: number;
}

@Component({
  selector: 'td-tag-detail-page',
  standalone: true,
  imports: [
    ReportSubpageHeaderComponent,
    ReportToolbarComponent,
    ReportOverviewComponent,
    ReportTableComponent,
  ],
  templateUrl: './tag-detail-page.component.html',
  styleUrl: './tag-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagDetailPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly siteLabel = signal('nieuwsblad.be');
  readonly analysisTypeLabel = signal('Single-day');
  readonly selectedDateLabel = signal('05/11/2025');

  readonly metricLabel = signal('pageviews');
  readonly breakdownLabel = signal('main metrics');

  readonly slug = signal(
    this.route.snapshot.paramMap.get('slug') ?? 'politiek'
  );

  readonly pageTitle = computed(() => this.slug().replace(/-/g, ' '));

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
              value: '275 961',
              delta: '+1,86%',
              deltaTone: 'positive',
            },
            {
              label: 'TOTAL PAGEVIEWS',
              value: '236 993',
              delta: '-0,64%',
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
              value: '7',
            },
            {
              label: 'TOTAL REGISTRATIONS',
              value: '18',
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
              value: '195 557 min',
              delta: '+3,14%',
              deltaTone: 'positive',
            },
            {
              label: 'ATTENTION TIME',
              value: '341 710 min',
              delta: '+2,44%',
              deltaTone: 'positive',
            },
          ],
        },
        {
          qualityItems: [
            {
              label: 'Bouncers',
              value: '13%',
              fillPercent: 13,
              tone: 'red',
            },
            {
              label: 'Scanners',
              value: '58%',
              fillPercent: 58,
              tone: 'yellow',
            },
            {
              label: 'Deeply reads',
              value: '29%',
              fillPercent: 29,
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

  readonly rows = signal<TagArticleRowSource[]>([
    {
      name: 'Arizona-regering wil snel hervormen: “Als het van ons afhangt, komt er tegen zomer al een grote wet”',
      pageviews: 66436,
      subscriberAttention: 95087,
      totalAttention: 123008,
      reads: 196796,
    },
    {
      name: 'Politieke crisis bezworen na nachtelijk overleg tussen meerderheidspartijen',
      pageviews: 58219,
      subscriberAttention: 73112,
      totalAttention: 101230,
      reads: 163942,
    },
    {
      name: 'Oppositie haalt hard uit naar nieuwe besparingsplannen van federale regering',
      pageviews: 44107,
      subscriberAttention: 58231,
      totalAttention: 81244,
      reads: 132905,
    },
    {
      name: 'Live | Kamerdebat loopt uit, premier reageert scherp op kritiek',
      pageviews: 36218,
      subscriberAttention: 47116,
      totalAttention: 69885,
      reads: 108332,
    },
    {
      name: 'Analyse: waarom deze beslissing de coalitie nog maanden kan achtervolgen',
      pageviews: 27894,
      subscriberAttention: 41220,
      totalAttention: 60318,
      reads: 88971,
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
