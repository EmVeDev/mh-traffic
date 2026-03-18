import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MhdIconComponent } from '@mh-traffic/mh-design';

export interface ReportOverviewMetric {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: 'positive' | 'negative';
  info?: boolean;
}

export interface ReportOverviewQualityItem {
  label: string;
  value: string;
  fillPercent: number;
  tone: 'red' | 'yellow' | 'green';
}

export interface ReportOverviewGroup {
  title: string;
  icon: string;
  sections: Array<{
    metrics?: ReportOverviewMetric[];
    qualityItems?: ReportOverviewQualityItem[];
  }>;
}

@Component({
  selector: 'td-report-overview',
  standalone: true,
  imports: [MhdIconComponent],
  templateUrl: './report-overview.component.html',
  styleUrl: './report-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportOverviewComponent {
  readonly title = input.required<string>();
  readonly leftGroups = input.required<ReportOverviewGroup[]>();
  readonly rightGroups = input.required<ReportOverviewGroup[]>();

  qualityFillClass(tone: ReportOverviewQualityItem['tone']): string {
    switch (tone) {
      case 'red':
        return 'quality-row__fill quality-row__fill--red';
      case 'yellow':
        return 'quality-row__fill quality-row__fill--yellow';
      case 'green':
        return 'quality-row__fill quality-row__fill--green';
    }
  }

  deltaClass(tone?: ReportOverviewMetric['deltaTone']): string {
    if (tone === 'positive') {
      return 'summary-metric-card__delta summary-metric-card__delta--positive';
    }

    if (tone === 'negative') {
      return 'summary-metric-card__delta summary-metric-card__delta--negative';
    }

    return 'summary-metric-card__delta';
  }
}
