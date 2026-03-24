import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MhdIconComponent } from '@mh-traffic/mh-design';

interface AudienceCard {
  id: string;
  title: string;
  headerColor: string;
  reach: {
    reads: string;
    wallHits: string;
    bouncers: string;
    totalPageviews: string;
  };
  engagement: {
    attentionTime: string;
    medianAttention: string;
    bouncers: string;
    scanners: string;
    deeplyReads: string;
  };
}

@Component({
  selector: 'td-article-additional-metrics-section',
  standalone: true,
  imports: [MhdIconComponent],
  templateUrl: './article-additional-metrics-section.component.html',
  styleUrl: './article-additional-metrics-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleAdditionalMetricsSectionComponent {
  readonly totalSegments = signal([
    { label: 'Subscriber (36%)', width: 36, color: '#c39a62' },
    { label: 'Registered (13%)', width: 13, color: '#b8c6ae' },
    { label: 'Anonymous (51%)', width: 51, color: '#d6ddd0' },
  ]);

  readonly audienceCards = signal<AudienceCard[]>([
    {
      id: 'subscriber',
      title: 'Subscriber',
      headerColor: '#c39a62',
      reach: {
        reads: '28 315',
        wallHits: '315',
        bouncers: '5 028',
        totalPageviews: '28 315',
      },
      engagement: {
        attentionTime: '28 667 min',
        medianAttention: '51 sec',
        bouncers: '15%',
        scanners: '64%',
        deeplyReads: '21%',
      },
    },
    {
      id: 'registered',
      title: 'Registered',
      headerColor: '#bcc8b2',
      reach: {
        reads: '701',
        wallHits: '11 789',
        bouncers: '135',
        totalPageviews: '12 625',
      },
      engagement: {
        attentionTime: '4 770 min',
        medianAttention: '46 sec',
        bouncers: '16%',
        scanners: '64%',
        deeplyReads: '20%',
      },
    },
    {
      id: 'anonymous',
      title: 'Anonymous',
      headerColor: '#d6ddd0',
      reach: {
        reads: '337',
        wallHits: '47 206',
        bouncers: '85',
        totalPageviews: '47 628',
      },
      engagement: {
        attentionTime: '15 313 min',
        medianAttention: '50 sec',
        bouncers: '20%',
        scanners: '57%',
        deeplyReads: '23%',
      },
    },
  ]);

  readonly lowerCards = signal<AudienceCard[]>([
    {
      id: 'non-subscriber',
      title: 'Non-Subscriber',
      headerColor: '#4c7487',
      reach: {
        reads: '10 000',
        wallHits: '58 995',
        bouncers: '220',
        totalPageviews: '60 253',
      },
      engagement: {
        attentionTime: '20 083 min',
        medianAttention: '14 sec',
        bouncers: '17%',
        scanners: '61%',
        deeplyReads: '21%',
      },
    },
    {
      id: 'total',
      title: 'Total',
      headerColor: '#e54f3b',
      reach: {
        reads: '28 836',
        wallHits: '59 310',
        bouncers: '5 248',
        totalPageviews: '93 911',
      },
      engagement: {
        attentionTime: '48 750 min',
        medianAttention: '146 sec',
        bouncers: '15%',
        scanners: '64%',
        deeplyReads: '21%',
      },
    },
  ]);

  trackCard(_index: number, item: AudienceCard): string {
    return item.id;
  }

  trackSegment(_index: number, item: { label: string }): string {
    return item.label;
  }
}
