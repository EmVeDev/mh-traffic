import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ReportSubpageHeaderComponent } from '../../features/report-subpage-header/report-subpage-header.component';
import { ArticleDetailHeaderComponent } from '../../features/article-detail-header/article-detail-header.component';
import { ArticleSummaryCardsComponent } from '../../features/article-summary-cards/article-summary-cards.component';
import { ArticleRelatedCardsComponent } from '../../features/article-related-cards/article-related-cards.component';
import { ArticleEventTimelineComponent } from '../../features/article-event-timeline/article-event-timeline.component';
import { ArticleReferrerSectionComponent } from '../../features/article-referrer-section/article-referrer-section.component';
import {
  ArticleTrafficBreakdownSectionComponent
} from '../../features/article-traffic-breakdown-section/article-traffic-breakdown-section.component';
import {
  ArticleAdditionalMetricsSectionComponent
} from '../../features/article-additional-metrics-section/article-additional-metrics-section.component';
import {
  ArticleDevicesTableSectionComponent
} from '../../features/article-devices-table-section/article-devices-table-section.component';
import {
  ArticleConversionSectionComponent
} from '../../features/article-conversion-section/article-conversion-section.component';
import {
  ArticleMediaEngagementSectionComponent
} from '../../features/article-media-engagement-section/article-media-engagement-section.component';

@Component({
  selector: 'td-article-detail-page',
  standalone: true,
  imports: [
    ReportSubpageHeaderComponent,
    ArticleDetailHeaderComponent,
    ArticleSummaryCardsComponent,
    ArticleRelatedCardsComponent,
    ArticleEventTimelineComponent,
    ArticleReferrerSectionComponent,
    ArticleTrafficBreakdownSectionComponent,
    ArticleAdditionalMetricsSectionComponent,
    ArticleDevicesTableSectionComponent,
    ArticleConversionSectionComponent,
    ArticleMediaEngagementSectionComponent,
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
