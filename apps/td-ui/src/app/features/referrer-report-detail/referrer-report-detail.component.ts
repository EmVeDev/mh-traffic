import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  JourneyBarComponent,
  MetricCardComponent,
  ReportPanelComponent,
  SimpleListCardComponent,
} from '@mh-traffic/mh-design';
@Component({
  selector: 'td-referrer-report-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReportPanelComponent,
    MetricCardComponent,
    JourneyBarComponent,
    SimpleListCardComponent,
  ],
  templateUrl: './referrer-report-detail.component.html',
  styleUrl: './referrer-report-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferrerReportDetailComponent {
  protected readonly beforeSegments = [
    { label: '6%', width: 6, className: 'green-dark' },
    { label: '3%', width: 3, className: 'green' },
    { label: '1%', width: 1, className: 'green-light' },
    { label: '81%', width: 81, className: 'grey' },
  ];

  protected readonly afterSegments = [
    { label: '9%', width: 9, className: 'green-dark' },
    { label: '0%', width: 0, className: 'green' },
    { label: '0%', width: 0, className: 'green-light' },
    { label: '2%', width: 2, className: 'grey-light' },
    { label: '89%', width: 89, className: 'grey' },
  ];

  protected readonly readBeforeRows = [
    {
      value: '146',
      label:
        'Jo (30) poseerde trots met reusachtige kreeft uit Canada, maar toen begon de miserie...',
    },
    {
      value: '137',
      label:
        'Luc Appermont op bezoek in eethuis van Ellen, maar dat is geen toeval',
    },
    {
      value: '125',
      label:
        'Suzie (32) verloor haar man toen hun dochter Anna 10 maanden oud was...',
    },
    {
      value: '124',
      label: 'Kelly (36) en Nico (38) zoeken geldschieters om pand te kopen...',
    },
    {
      value: '102',
      label: '“Dat je zulke uitspraken nog in 2025 doet, snap ik niet”...',
    },
  ];

  protected readonly readAfterRows = [
    {
      value: '29 400',
      label: 'Jo (30) poseerde trots met reusachtige kreeft uit Canada...',
    },
    {
      value: '27 000',
      label:
        'Luc Appermont op bezoek in eethuis van Ellen, maar dat is geen toeval',
    },
    {
      value: '27 000',
      label:
        'Suzie (32) verloor haar man toen hun dochter Anna 10 maanden oud was...',
    },
    {
      value: '25 700',
      label: 'Kelly (36) en Nico (38) zoeken geldschieters om pand te kopen...',
    },
    {
      value: '25 600',
      label: '“Dat je zulke uitspraken nog in 2025 doet, snap ik niet”...',
    },
  ];

  protected readonly deviceRows = [
    ['phone / web', '21 458', '29 938', '3 733', '51 sec'],
    ['phone / news-app', '12 091', '16 246', '16 246', '52 sec'],
    ['phone / Digi-paper', '0', '0', '0', '0 sec'],
    ['tablet / web', '1 426', '2 156', '463', '51 sec'],
    ['tablet / Digi-paper', '0', '0', '0', '0 sec'],
    ['Desktop / web', '13 572', '20 785', '8 073', '51 sec'],
    ['Desktop / Digi-paper', '0', '0', '0', '0 sec'],
  ];
}
