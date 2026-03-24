import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MhdIconComponent } from '@mh-traffic/mh-design';

interface MediaRow {
  id: string;
  imageUrl: string;
  siteLabel: string;
  title: string;
  source: string;
  duration: string;
  plays: number;
  downloads: number;
  totalInteractions: number;
}

@Component({
  selector: 'td-article-media-engagement-section',
  standalone: true,
  templateUrl: './article-media-engagement-section.component.html',
  styleUrl: './article-media-engagement-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MhdIconComponent],
})
export class ArticleMediaEngagementSectionComponent {
  readonly rows = signal<MediaRow[]>([
    {
      id: 'media-1',
      imageUrl:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=200&q=80',
      siteLabel: 'N',
      title:
        'Waardevolle spullen begraven en geen zand in je gsm: Lena deelt enkele handige trucjes voor een zorgeloos dagje op het strand?',
      source: 'GLITR',
      duration: '00:01:10',
      plays: 2371,
      downloads: 0,
      totalInteractions: 2371,
    },
    {
      id: 'media-2',
      imageUrl:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80',
      siteLabel: 'N',
      title:
        'Moeder deelt slim trucje om waardevolle spullen te verbergen tijdens een dagje strand: "Want wie steelt nu een vuile luier?"',
      source: 'GLITR',
      duration: '00:00:50',
      plays: 1165,
      downloads: 0,
      totalInteractions: 1165,
    },
  ]);

  trackRow(_index: number, row: MediaRow): string {
    return row.id;
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('nl-BE').format(value);
  }
}
