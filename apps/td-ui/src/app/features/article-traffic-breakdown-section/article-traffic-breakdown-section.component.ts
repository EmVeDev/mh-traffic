import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { MhdIconComponent } from '@mh-traffic/mh-design';

interface TrafficSourceStat {
  id: string;
  label: string;
  shortLabel: string;
  percentage: number;
  color: string;
  icon: string;
  iconSet: string;
}

interface ReadBeforeItem {
  rank: number;
  siteLabel: string;
  title: string;
  value: number;
}

interface ReadAfterItem {
  value: number;
  siteLabel: string;
  title: string;
}

@Component({
  selector: 'td-article-traffic-breakdown-section',
  standalone: true,
  imports: [MhdIconComponent],
  templateUrl: './article-traffic-breakdown-section.component.html',
  styleUrl: './article-traffic-breakdown-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleTrafficBreakdownSectionComponent {
  readonly beforeSources = signal<TrafficSourceStat[]>([
    {
      id: 'internal-article',
      label: 'Internal article',
      shortLabel: '6%',
      percentage: 6,
      color: '#119462',
      icon: 'fa-file-lines',
      iconSet: 'fas',
    },
    {
      id: 'homepage',
      label: 'Homepage',
      shortLabel: '3%',
      percentage: 3,
      color: '#26d4a0',
      icon: 'fa-house',
      iconSet: 'fas',
    },
    {
      id: 'internal-other',
      label: 'Internal other',
      shortLabel: '1%',
      percentage: 1,
      color: '#24cfc4',
      icon: 'fa-list',
      iconSet: 'fas',
    },
    {
      id: 'external-source',
      label: 'External source',
      shortLabel: '81%',
      percentage: 81,
      color: '#8199a4',
      icon: 'fa-arrow-up-right-from-square',
      iconSet: 'fas',
    },
  ]);

  readonly afterSources = signal<TrafficSourceStat[]>([
    {
      id: 'read-on',
      label: 'Read on',
      shortLabel: '9%',
      percentage: 9,
      color: '#119462',
      icon: 'fa-rotate-right',
      iconSet: 'fas',
    },
    {
      id: 'read-homepage',
      label: 'Read homepage',
      shortLabel: '0%',
      percentage: 0,
      color: '#26d4a0',
      icon: 'fa-house',
      iconSet: 'fas',
    },
    {
      id: 'read-other-page',
      label: 'Read other page',
      shortLabel: '0%',
      percentage: 0,
      color: '#24cfc4',
      icon: 'fa-list',
      iconSet: 'fas',
    },
    {
      id: 'passing-through',
      label: 'Passing through',
      shortLabel: '2%',
      percentage: 2,
      color: '#b8c7cf',
      icon: 'fa-shuffle',
      iconSet: 'fas',
    },
    {
      id: 'exits',
      label: 'Exits',
      shortLabel: '89%',
      percentage: 89,
      color: '#8199a4',
      icon: 'fa-right-from-bracket',
      iconSet: 'fas',
    },
  ]);

  readonly readBeforeItems = signal<ReadBeforeItem[]>([
    {
      rank: 146,
      siteLabel: 'N',
      title:
        'Jo (30) poseerde trots met reusachtige kreeft uit Canada, maar toen begon de miserie: “Ik wil gewoon dat het stopt”',
      value: 800,
    },
    {
      rank: 137,
      siteLabel: 'N',
      title:
        'Luc Appermont op bezoek in eethuis van Ellen, maar dat is geen toeval',
      value: 640,
    },
    {
      rank: 125,
      siteLabel: 'N',
      title:
        'Suzie (32) verloor haar man toen hun dochter Anna 10 maanden oud was: “Ik voel me vaak het buitenbeentje”',
      value: 560,
    },
    {
      rank: 124,
      siteLabel: 'N',
      title:
        'Kelly (36) en Nico (38) zoeken geldschieters om pand van hun frituur te kunnen kopen: “We willen hier graag blijven”',
      value: 460,
    },
    {
      rank: 102,
      siteLabel: 'N',
      title:
        '“Dat je zulke uitspraken nog in 2025 doet, snap ik niet”: gemoederen lopen hoog op na uitspraak van nieuwe Miss België',
      value: 420,
    },
  ]);

  readonly readAfterItems = signal<ReadAfterItem[]>([
    {
      value: 29400,
      siteLabel: 'N',
      title:
        'Jo (30) poseerde trots met reusachtige kreeft uit Canada, maar toen begon de miserie: “Ik wil gewoon dat het stopt”',
    },
    {
      value: 27000,
      siteLabel: 'N',
      title:
        'Luc Appermont op bezoek in eethuis van Ellen, maar dat is geen toeval',
    },
    {
      value: 27000,
      siteLabel: 'N',
      title:
        'Suzie (32) verloor haar man toen hun dochter Anna 10 maanden oud was: “Ik voel me vaak het buitenbeentje”',
    },
    {
      value: 25700,
      siteLabel: 'N',
      title:
        'Kelly (36) en Nico (38) zoeken geldschieters om pand van hun frituur te kunnen kopen: “We willen hier graag blijven”',
    },
    {
      value: 25600,
      siteLabel: 'N',
      title:
        '“Dat je zulke uitspraken nog in 2025 doet, snap ik niet”: gemoederen lopen hoog op na uitspraak van nieuwe Miss België',
    },
  ]);

  readonly beforeTotal = computed(() =>
    this.beforeSources().reduce((sum, item) => sum + item.percentage, 0)
  );

  readonly afterTotal = computed(() =>
    this.afterSources().reduce((sum, item) => sum + item.percentage, 0)
  );

  trackSource(_index: number, item: TrafficSourceStat): string {
    return item.id;
  }

  trackBeforeItem(_index: number, item: ReadBeforeItem): number {
    return item.rank;
  }

  trackAfterItem(_index: number, item: ReadAfterItem): string {
    return `${item.value}-${item.title}`;
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('nl-BE').format(value);
  }
}
