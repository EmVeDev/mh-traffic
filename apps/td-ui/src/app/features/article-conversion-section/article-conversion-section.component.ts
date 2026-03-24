import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MhdIconComponent } from '@mh-traffic/mh-design';

interface ConversionMetric {
  id: string;
  label: string;
  value: string;
  delta?: string;
}

@Component({
  selector: 'td-article-conversion-section',
  standalone: true,
  imports: [MhdIconComponent],
  templateUrl: './article-conversion-section.component.html',
  styleUrl: './article-conversion-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleConversionSectionComponent {
  readonly loginFlow = signal<ConversionMetric[]>([
    { id: 'wall-hits', label: 'Login wall hits', value: '51 436' },
    { id: 'start-login', label: 'Start login', value: '4 621', delta: '8,9%' },
    { id: 'logged-in', label: 'Logged in', value: '3 512', delta: '76%' },
    {
      id: 'start-registration',
      label: 'Start registration',
      value: '26',
      delta: '0,05%',
    },
    { id: 'registered', label: 'Registered', value: '5', delta: '19%' },
  ]);

  readonly paywallFlow = signal<ConversionMetric[]>([
    { id: 'paywall-hits', label: 'Paywall hits', value: '11 988' },
    { id: 'offer-clicks', label: 'Offer clicks', value: '26', delta: '0,21%' },
    { id: 'new-subscriptions', label: 'New subscriptions', value: '0' },
  ]);

  trackMetric(_index: number, item: ConversionMetric): string {
    return item.id;
  }
}
