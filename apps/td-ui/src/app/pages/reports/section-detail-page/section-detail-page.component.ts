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

interface SectionArticleRowSource {
  name: string;
  pageviews: number;
  subscriberAttention: number;
  totalAttention: number;
  reads: number;
}

@Component({
  selector: 'td-section-detail-page',
  standalone: true,
  imports: [
    ReportSubpageHeaderComponent,
    ReportToolbarComponent,
    ReportOverviewComponent,
    ReportTableComponent,
  ],
  templateUrl: './section-detail-page.component.html',
  styleUrl: './section-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionDetailPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly siteLabel = signal('nieuwsblad.be');
  readonly analysisTypeLabel = signal('Single-day');
  readonly selectedDateLabel = signal('05/11/2025');

  readonly metricLabel = signal('pageviews');
  readonly breakdownLabel = signal('main metrics');

  readonly slug = signal(
    this.route.snapshot.paramMap.get('slug') ?? 'nb-politiek'
  );

  readonly pageTitle = computed(() => this.slug().replace(/-/g, '/'));

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
              value: '247 970',
              delta: '+1,42%',
              deltaTone: 'positive',
            },
            {
              label: 'TOTAL PAGEVIEWS',
              value: '224 795',
              delta: '-0,38%',
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
              value: '4',
            },
            {
              label: 'TOTAL REGISTRATIONS',
              value: '11',
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
              value: '123 257 min',
              delta: '+2,71%',
              deltaTone: 'positive',
            },
            {
              label: 'ATTENTION TIME',
              value: '232 717 min',
              delta: '+1,95%',
              deltaTone: 'positive',
            },
          ],
        },
        {
          qualityItems: [
            {
              label: 'Bouncers',
              value: '14%',
              fillPercent: 14,
              tone: 'red',
            },
            {
              label: 'Scanners',
              value: '57%',
              fillPercent: 57,
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

  readonly rows = signal<SectionArticleRowSource[]>([
    {
      name: 'Nieuwe spanningen binnen meerderheid na uitgelekte nota over begroting',
      pageviews: 53421,
      subscriberAttention: 64110,
      totalAttention: 90214,
      reads: 129883,
    },
    {
      name: 'Premier reageert op kritiek van oppositie: “We kiezen voor verantwoordelijkheid”',
      pageviews: 48932,
      subscriberAttention: 59004,
      totalAttention: 81232,
      reads: 118440,
    },
    {
      name: 'Achtergrond | Waarom de hervorming van de kieswet opnieuw op tafel ligt',
      pageviews: 37225,
      subscriberAttention: 48219,
      totalAttention: 70118,
      reads: 101224,
    },
    {
      name: 'Live debat in parlement lokt felle reacties uit bij coalitie en oppositie',
      pageviews: 31884,
      subscriberAttention: 40118,
      totalAttention: 59841,
      reads: 88651,
    },
    {
      name: 'Analyse: welke strategische fout maakte de regering deze week?',
      pageviews: 26517,
      subscriberAttention: 33711,
      totalAttention: 51202,
      reads: 74198,
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
