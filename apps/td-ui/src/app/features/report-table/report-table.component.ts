import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MhdIconComponent } from '@mh-traffic/mh-design';

export interface ReportTableDistributionSegment {
  label: string;
  shortLabel: string;
  valueLabel: string;
  percentageLabel: string;
  percentage: number;
  colorClass: string;
  tooltip: string;
}

export interface ReportTableColumn {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
}

export interface ReportTableRow {
  name: string;
  values: Record<string, string>;
  distributionSegments?: ReportTableDistributionSegment[];
  link?: string;
}

export interface ReportTableTotalsRow {
  name: string;
  values: Record<string, string>;
  distributionSegments?: ReportTableDistributionSegment[];
}

@Component({
  selector: 'td-report-table',
  standalone: true,
  imports: [MhdIconComponent, RouterLink],
  templateUrl: './report-table.component.html',
  styleUrl: './report-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportTableComponent {
  readonly title = input.required<string>();
  readonly firstColumnHeader = input.required<string>();
  readonly columns = input.required<ReportTableColumn[]>();
  readonly rows = input.required<ReportTableRow[]>();
  readonly totals = input.required<ReportTableTotalsRow>();

  readonly valueDisplayMode = input<'raw' | 'percentage'>('raw');
  readonly tableDisplayMode = input<'chart' | 'table'>('table');
  readonly distributionColumnLabel = input<string>('Distribution');

  cellAlignClass(align: ReportTableColumn['align'] = 'right'): string {
    switch (align) {
      case 'left':
        return 'table-card__cell--left';
      case 'center':
        return 'table-card__cell--center';
      case 'right':
      default:
        return 'table-card__cell--right';
    }
  }

  hasDistribution(): boolean {
    return this.tableDisplayMode() === 'chart';
  }

  distributionAriaLabel(rowName: string): string {
    return `${rowName} distribution`;
  }
}
