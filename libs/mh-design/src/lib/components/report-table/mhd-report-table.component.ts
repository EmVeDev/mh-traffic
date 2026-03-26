import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MhdIconComponent } from '../icon/mhd-icon.component';

export type ReportTableValueType = 'text' | 'number' | 'percentage';

export interface ReportTableColumn {
  key: string;
  label: string;
  align?: 'left' | 'right';
  type?: ReportTableValueType;
  tooltip?: string;
}

export interface ReportTableFirstColumnConfig {
  key: string;
  label: string;
}

export interface ReportTableDistributionSegment {
  label: string;
  shortLabel: string;
  valueLabel: string;
  percentageLabel: string;
  percentage: number;
  tooltip: string;
  color?: string;
}

export interface ReportTableRow {
  id: string;
  name: string;
  link?: string;
  expandable?: boolean;
  initiallyExpanded?: boolean;
  values: Record<string, string | number>;
  distributionSegments?: ReportTableDistributionSegment[];
  children?: ReportTableRow[];
}

@Component({
  selector: 'mhd-report-table',
  standalone: true,
  imports: [MhdIconComponent, RouterLink],
  templateUrl: './mhd-report-table.component.html',
  styleUrl: './mhd-report-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MhdReportTableComponent {
  readonly title = input('');
  readonly firstColumnHeader = input('Name');
  readonly firstColumn = input<ReportTableFirstColumnConfig | null>(null);

  readonly columns = input.required<ReportTableColumn[]>();
  readonly rows = input.required<ReportTableRow[]>();
  readonly totals = input<any>();

  readonly valueDisplayMode = input<'raw' | 'percentage'>('raw');
  readonly tableDisplayMode = input<'table' | 'chart'>('table');
  readonly distributionColumnLabel = input('Distribution');
  readonly locale = input('nl-BE');

  protected readonly expandedRowIds = signal<Set<string>>(new Set());

  private readonly fallbackSegmentColors = [
    '#43b2ff',
    '#ef6a59',
    '#f2c94c',
    '#6fcf97',
    '#9b51e0',
    '#2d9cdb',
    '#f2994a',
    '#27ae60',
    '#56ccf2',
    '#bb6bd9',
  ] as const;

  protected readonly displayColumns = computed(() => this.columns());

  protected readonly resolvedFirstColumn =
    computed<ReportTableFirstColumnConfig>(() => {
      return (
        this.firstColumn() ?? {
          key: 'name',
          label: this.firstColumnHeader(),
        }
      );
    });

  protected readonly showDistributionColumn = computed(
    () => this.tableDisplayMode() === 'chart'
  );

  protected readonly visibleRows = computed(() => {
    const expanded = this.expandedRowIds();
    const result: Array<{ row: ReportTableRow; level: number }> = [];

    const visit = (rows: ReportTableRow[], level: number): void => {
      for (const row of rows) {
        result.push({ row, level });

        if (row.children?.length && expanded.has(row.id)) {
          visit(row.children, level + 1);
        }
      }
    };

    visit(this.rows(), 0);
    return result;
  });

  constructor() {
    computed(() => {
      const expanded = new Set<string>();

      const collect = (rows: ReportTableRow[]) => {
        for (const row of rows) {
          if (row.initiallyExpanded && row.children?.length) {
            expanded.add(row.id);
          }

          if (row.children?.length) {
            collect(row.children);
          }
        }
      };

      collect(this.rows());
      this.expandedRowIds.set(expanded);
    });
  }

  protected isRightAligned(column: ReportTableColumn): boolean {
    return (
      column.align === 'right' ||
      column.type === 'number' ||
      column.type === 'percentage'
    );
  }

  protected formatValue(
    column: ReportTableColumn,
    value: string | number | undefined
  ): string {
    if (value === undefined || value === null || value === '') {
      return '—';
    }

    if (typeof value === 'string') {
      return value;
    }

    if (column.type === 'percentage') {
      return `${Math.round(value)}%`;
    }

    if (column.type === 'number') {
      return new Intl.NumberFormat(this.locale()).format(value);
    }

    return String(value);
  }

  protected hasChildren(row: ReportTableRow): boolean {
    return !!row.children?.length;
  }

  protected isExpanded(row: ReportTableRow): boolean {
    return this.expandedRowIds().has(row.id);
  }

  protected toggleRow(row: ReportTableRow): void {
    if (!row.children?.length) {
      return;
    }

    this.expandedRowIds.update((current) => {
      const next = new Set(current);

      if (next.has(row.id)) {
        next.delete(row.id);
      } else {
        next.add(row.id);
      }

      return next;
    });
  }

  protected rowIndent(level: number): string {
    return `${level * 24}px`;
  }

  protected getSegmentColor(
    segment: ReportTableDistributionSegment,
    index: number
  ): string {
    return (
      segment.color ??
      this.fallbackSegmentColors[index % this.fallbackSegmentColors.length]
    );
  }

  protected trackByVisibleRow = (
    _: number,
    item: { row: ReportTableRow; level: number }
  ) => item.row.id;
}
