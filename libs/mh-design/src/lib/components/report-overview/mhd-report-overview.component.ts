import {
  ChangeDetectionStrategy,
  Component,
  SecurityContext,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MhdChartComponent } from '../chart/mhd-chart.component';
import { MhdChartConfig } from '../chart/mhd-chart.types';
import { MhdSummaryCardComponent } from '../summary-card/mhd-summary-card.component';
import { MhdSummaryMetricComponent } from '../summary-metric/mhd-summary-metric.component';
import {
  MhdSummaryQualityComponent,
  MhdSummaryQualityItem,
} from '../summary-quality/mhd-summary-quality.component';
import { MhdSummarySectionComponent } from '../summary-section/mhd-summary-section.component';

export interface ReportOverviewMetric {
  label: string;
  value: string | number;
  valueType?: 'text' | 'number';
  valueSuffix?: string;
  delta?: string;
  deltaTone?: 'positive' | 'negative' | 'neutral';
  info?: boolean;
}

export interface ReportOverviewGroupSection {
  metrics?: ReportOverviewMetric[];
  qualityItems?: MhdSummaryQualityItem[];
}

export interface ReportOverviewGroup {
  title: string;
  icon: string;
  sections: ReportOverviewGroupSection[];
}

@Component({
  selector: 'mhd-report-overview',
  standalone: true,
  imports: [
    MhdSummaryCardComponent,
    MhdSummaryMetricComponent,
    MhdSummaryQualityComponent,
    MhdSummarySectionComponent,
    MhdChartComponent,
  ],
  templateUrl: './mhd-report-overview.component.html',
  styleUrl: './mhd-report-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MhdReportOverviewComponent {
  private readonly sanitizer = inject(DomSanitizer);

  private readonly chartComponent = viewChild(MhdChartComponent);

  readonly title = input.required<string>();
  readonly leftGroups = input.required<ReportOverviewGroup[]>();
  readonly rightGroups = input.required<ReportOverviewGroup[]>();
  readonly chartConfig = input<MhdChartConfig | null>(null);

  protected readonly sanitizedTitle = computed(
    () => this.sanitizer.sanitize(SecurityContext.HTML, this.title()) ?? ''
  );

  protected metricsFor(
    section: ReportOverviewGroupSection
  ): ReportOverviewMetric[] {
    return section.metrics ?? [];
  }

  protected qualityItemsFor(
    section: ReportOverviewGroupSection
  ): MhdSummaryQualityItem[] {
    return section.qualityItems ?? [];
  }

  async exportChartAsPng(filename?: string): Promise<void> {
    await this.chartComponent()?.exportChartAsPng(filename);
  }
}
