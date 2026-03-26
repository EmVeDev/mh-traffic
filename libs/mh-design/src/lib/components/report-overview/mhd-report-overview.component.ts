import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  MhdIconComponent,
  MhdSummaryCardComponent,
  MhdSummaryMetricComponent,
  MhdSummaryQualityComponent,
  MhdSummaryQualityItem,
  MhdSummarySectionComponent,
} from '@mh-traffic/mh-design';

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
    MhdIconComponent,
    MhdSummaryCardComponent,
    MhdSummaryMetricComponent,
    MhdSummaryQualityComponent,
    MhdSummarySectionComponent,
  ],
  templateUrl: './mhd-report-overview.component.html',
  styleUrl: './mhd-report-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MhdReportOverviewComponent {
  readonly title = input.required<string>();
  readonly leftGroups = input.required<ReportOverviewGroup[]>();
  readonly rightGroups = input.required<ReportOverviewGroup[]>();

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
}
