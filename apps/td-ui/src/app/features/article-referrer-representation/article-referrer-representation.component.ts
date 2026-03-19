import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { MhdIconComponent } from '@mh-traffic/mh-design';
import { UpperCasePipe } from '@angular/common';

interface ArticleReferrerRow {
  id: string;
  name: string;
  pageviews: number;
  attentionLabel: string;
  percentage: number;
  reads: number;
  subscriberAttention: string;
  totalAttention: string;
  color: string;
  tint: string;
  icon: string;
  iconSet: string;
}

@Component({
  selector: 'td-article-referrer-representation',
  standalone: true,
  imports: [MhdIconComponent, UpperCasePipe],
  templateUrl: './article-referrer-representation.component.html',
  styleUrl: './article-referrer-representation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleReferrerRepresentationComponent {
  readonly expanded = signal(false);
  readonly selectedId = signal('facebook');

  readonly rows = signal<ArticleReferrerRow[]>([
    {
      id: 'facebook',
      name: 'Facebook',
      pageviews: 31596,
      attentionLabel: '14 sec',
      percentage: 34,
      reads: 5134,
      subscriberAttention: '11 527 min',
      totalAttention: '31 596',
      color: '#4662a9',
      tint: '#eef2fb',
      icon: 'fa-facebook-f',
      iconSet: 'fab',
    },
    {
      id: 'internal-article',
      name: 'Internal article',
      pageviews: 19936,
      attentionLabel: '23 sec',
      percentage: 22,
      reads: 4211,
      subscriberAttention: '7 903 min',
      totalAttention: '19 936',
      color: '#0f9a67',
      tint: '#ecf8f3',
      icon: 'fa-file-lines',
      iconSet: 'fas',
    },
    {
      id: 'internal-home',
      name: 'Internal home',
      pageviews: 16644,
      attentionLabel: '24 sec',
      percentage: 18,
      reads: 3908,
      subscriberAttention: '6 841 min',
      totalAttention: '16 644',
      color: '#1fca96',
      tint: '#ebfbf6',
      icon: 'fa-house',
      iconSet: 'fas',
    },
    {
      id: 'newsletter',
      name: 'Newsletters',
      pageviews: 13665,
      attentionLabel: '24 sec',
      percentage: 15,
      reads: 3344,
      subscriberAttention: '5 214 min',
      totalAttention: '13 665',
      color: '#ea5244',
      tint: '#fff1ef',
      icon: 'fa-envelope',
      iconSet: 'fas',
    },
    {
      id: 'google-discover',
      name: 'Google Discover',
      pageviews: 3116,
      attentionLabel: '14 sec',
      percentage: 6,
      reads: 1020,
      subscriberAttention: '1 332 min',
      totalAttention: '3 116',
      color: '#f5b400',
      tint: '#fff8e1',
      icon: 'fa-google',
      iconSet: 'fab',
    },
    {
      id: 'google',
      name: 'Google',
      pageviews: 2263,
      attentionLabel: '14 sec',
      percentage: 5,
      reads: 811,
      subscriberAttention: '984 min',
      totalAttention: '2 263',
      color: '#f5b400',
      tint: '#fff8e1',
      icon: 'fa-google',
      iconSet: 'fab',
    },
    {
      id: 'push',
      name: 'Push',
      pageviews: 1543,
      attentionLabel: '12 sec',
      percentage: 2,
      reads: 442,
      subscriberAttention: '612 min',
      totalAttention: '1 543',
      color: '#0d6b47',
      tint: '#edf7f3',
      icon: 'fa-bell',
      iconSet: 'fas',
    },
    {
      id: 'direct',
      name: 'Direct',
      pageviews: 804,
      attentionLabel: '09 sec',
      percentage: 1,
      reads: 205,
      subscriberAttention: '228 min',
      totalAttention: '804',
      color: '#607080',
      tint: '#f3f5f7',
      icon: 'fa-arrow-right',
      iconSet: 'fas',
    },
  ]);

  readonly visibleRows = computed(() => {
    const rows = this.rows();
    return this.expanded() ? rows : rows.slice(0, 6);
  });

  readonly selectedRow = computed(() => {
    const selected = this.rows().find((row) => row.id === this.selectedId());
    return selected ?? this.rows()[0];
  });

  selectRow(id: string): void {
    this.selectedId.set(id);
  }

  toggleExpanded(): void {
    this.expanded.update((value) => !value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('nl-BE').format(value);
  }
}
