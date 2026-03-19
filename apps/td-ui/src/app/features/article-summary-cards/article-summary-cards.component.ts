import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MhdIconComponent } from '@mh-traffic/mh-design';

@Component({
  selector: 'td-article-summary-cards',
  standalone: true,
  imports: [MhdIconComponent],
  templateUrl: './article-summary-cards.component.html',
  styleUrl: './article-summary-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleSummaryCardsComponent {}
