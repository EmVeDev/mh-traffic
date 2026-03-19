import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MhdIconComponent } from '@mh-traffic/mh-design';

interface RelatedCardMetric {
  icon: string;
  iconSet?: string;
  value: string;
}

interface RelatedCardItem {
  source: string;
  timeLabel: string;
  title: string;
  imageUrl?: string;
  excerpt?: string;
  footerValue?: string;
  metrics?: RelatedCardMetric[];
  sourceIcon?: string;
  sourceIconSet?: string;
}

interface RelatedCardGroup {
  id: string;
  title: string;
  icon: string;
  iconSet?: string;
  total: string;
  accentClass: string;
  items: RelatedCardItem[];
}

@Component({
  selector: 'td-article-related-cards',
  standalone: true,
  imports: [MhdIconComponent],
  templateUrl: './article-related-cards.component.html',
  styleUrl: './article-related-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleRelatedCardsComponent {
  readonly fallbackImage =
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80';

  readonly groups = signal<RelatedCardGroup[]>([
    {
      id: 'facebook',
      title: 'Facebook',
      icon: 'fa-facebook-f',
      iconSet: 'fab',
      total: '31 596',
      accentClass: 'related-group--facebook',
      items: [
        {
          source: 'Nieuwsblad.be',
          sourceIcon: 'fa-facebook-f',
          sourceIconSet: 'fab',
          timeLabel: 'dinsdag 18 februari 2025 12:40',
          excerpt:
            '“ik kreeg een telefoontje van de gemeente, maar ik had helemaal geen racistische bedoelingen.”',
          title:
            'Valerie (51) onder vuur voor boodschap op reclamebord van haar tearoom: “Je moet tegenwoordig elk woord wikken e…”',
          imageUrl: this.fallbackImage,
          metrics: [
            { icon: 'fa-thumbs-up', value: '1 665' },
            { icon: 'fa-comment', value: '968' },
            { icon: 'fa-share', value: '25' },
          ],
        },
        {
          source: 'Al het nieuws uit Middelkerke',
          sourceIcon: 'fa-facebook-f',
          sourceIconSet: 'fab',
          timeLabel: 'dinsdag 18 februari 2025 11:22',
          title:
            'Valerie (51) onder vuur voor boodschap op reclamebord van haar tearoom: “Je moet tegenwoordig elk woord wikken e…”',
          imageUrl: this.fallbackImage,
          metrics: [
            { icon: 'fa-thumbs-up', value: '2' },
            { icon: 'fa-comment', value: '0' },
            { icon: 'fa-share', value: '0' },
          ],
        },
        {
          source: 'Al het nieuws uit Middelkerke',
          sourceIcon: 'fa-facebook-f',
          sourceIconSet: 'fab',
          timeLabel: 'dinsdag 18 februari 2025 10:55',
          title:
            'Racistisch of niet? Valerie (51) schrijft opmerkelijke boodschap op reclamebord van tearoom: “Je moet tegenwoordig elk woord wikken e…”',
          imageUrl: this.fallbackImage,
          metrics: [
            { icon: 'fa-thumbs-up', value: '3' },
            { icon: 'fa-comment', value: '0' },
            { icon: 'fa-share', value: '0' },
          ],
        },
      ],
    },
    {
      id: 'newsletter',
      title: 'Newsletters',
      icon: 'fa-envelope',
      iconSet: 'fas',
      total: '13 665',
      accentClass: 'related-group--newsletter',
      items: [
        {
          source: 'LUNCH',
          sourceIcon: 'fa-newspaper',
          sourceIconSet: 'fas',
          timeLabel: 'dinsdag 18 februari 2025 11:99',
          title:
            'Valerie (51) onder vuur voor boodschap op reclamebord van haar tearoom: “Je moet tegenwoordig elk woord wikken e…”',
          imageUrl: this.fallbackImage,
          footerValue: '2 332',
        },
        {
          source: 'GEMEENTE',
          sourceIcon: 'fa-newspaper',
          sourceIconSet: 'fas',
          timeLabel: 'dinsdag 18 februari 2025 11:99',
          title:
            'Valerie (51) onder vuur voor boodschap op reclamebord van haar tearoom: “Je moet tegenwoordig elk woord wikken e…”',
          imageUrl: this.fallbackImage,
          footerValue: '7 720',
        },
      ],
    },
    {
      id: 'push',
      title: 'Push',
      icon: 'fa-bell',
      iconSet: 'fas',
      total: '0',
      accentClass: 'related-group--push',
      items: [
        {
          source: '10:34',
          sourceIcon: 'fa-apple',
          sourceIconSet: 'fab',
          timeLabel: 'dinsdag 18 februari 2025',
          title:
            'Valerie (51) onder vuur voor boodschap op reclamebord van haar tearoom: “Je moet tegenwoordig elk woord wikken e…”',
          imageUrl: this.fallbackImage,
          footerValue: '0',
        },
        {
          source: '10:34',
          sourceIcon: 'fa-android',
          sourceIconSet: 'fab',
          timeLabel: 'dinsdag 18 februari 2025',
          title:
            'Valerie (51) onder vuur voor boodschap op reclamebord van haar tearoom: “Je moet tegenwoordig elk woord wikken e…”',
          imageUrl: this.fallbackImage,
          footerValue: '0',
        },
      ],
    },
  ]);
}
