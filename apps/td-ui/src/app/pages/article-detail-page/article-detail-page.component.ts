import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MhdIconComponent } from '@mh-traffic/mh-design';
import { ReportSubpageHeaderComponent } from '../../features/report-subpage-header/report-subpage-header.component';
import { ArticleDetailHeaderComponent } from '../../features/article-detail-header/article-detail-header.component';
import { ArticleSummaryCardsComponent } from '../../features/article-summary-cards/article-summary-cards.component';
import { ArticleSectionPlaceholderComponent } from '../../features/article-section-placeholder/article-section-placeholder.component';
import { ArticleReferrerRepresentationComponent } from '../../features/article-referrer-representation/article-referrer-representation.component';
import { ArticleRelatedCardsComponent } from '../../features/article-related-cards/article-related-cards.component';
import { ArticleEventTimelineComponent } from '../../features/article-event-timeline/article-event-timeline.component';

@Component({
  selector: 'td-article-detail-page',
  standalone: true,
  imports: [
    ReportSubpageHeaderComponent,
    ArticleDetailHeaderComponent,
    ArticleSummaryCardsComponent,
    ArticleSectionPlaceholderComponent,
    ArticleReferrerRepresentationComponent,
    ArticleRelatedCardsComponent,
    ArticleEventTimelineComponent,
  ],
  templateUrl: './article-detail-page.component.html',
  styleUrl: './article-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleDetailPageComponent {
  readonly siteLabel = signal('nieuwsblad.be');
  readonly analysisTypeLabel = signal('Single-day');
  readonly selectedDateLabel = signal('05/11/2025');
}
