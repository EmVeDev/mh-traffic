import {
  ChangeDetectionStrategy,
  Component,
  SecurityContext,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { MhdIconComponent } from '../icon/mhd-icon.component';

export type ReportTableValueType = 'text' | 'number' | 'percentage';
export type ReportTableSortDirection = 'asc' | 'desc';
export type ReportTableSortMode = 'column' | 'distribution';

export interface ReportTableSortState {
  mode: ReportTableSortMode;
  key: string;
  direction: ReportTableSortDirection;
}

export interface ReportTableColumn {
  key: string;
  label: string;
  align?: 'left' | 'right';
  type?: ReportTableValueType;
  tooltip?: string;
  sortable?: boolean;
}

export interface ReportTableFirstColumnConfig {
  key: string;
  label: string;
}

export interface ReportTableDistributionSegment {
  key: string;
  label: string;
  shortLabel: string;
  value: number;
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
  private readonly sanitizer = inject(DomSanitizer);

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

  readonly enablePagination = input(false);
  readonly defaultPageSize = input(10);
  readonly pageSizeOptions = input<readonly number[]>([10, 25, 50, 200]);

  protected readonly expandedRowIds = signal<Set<string>>(new Set());
  protected readonly sortState = signal<ReportTableSortState | null>(null);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);

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

  protected readonly sanitizedTitle = computed(
    () => this.sanitizer.sanitize(SecurityContext.HTML, this.title()) ?? ''
  );

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

  protected readonly distributionHeaderSegments = computed(() => {
    const findSegments = (
      rows: ReportTableRow[]
    ): ReportTableDistributionSegment[] => {
      for (const row of rows) {
        if (row.distributionSegments?.length) {
          return row.distributionSegments;
        }

        if (row.children?.length) {
          const childSegments = findSegments(row.children);
          if (childSegments.length) {
            return childSegments;
          }
        }
      }

      return [];
    };

    return findSegments(this.rows());
  });

  protected readonly sortedRows = computed(() => {
    return this.sortRows(this.rows());
  });

  protected readonly totalTopLevelRows = computed(
    () => this.sortedRows().length
  );

  protected readonly totalPages = computed(() => {
    if (!this.enablePagination()) {
      return 1;
    }

    return Math.max(1, Math.ceil(this.totalTopLevelRows() / this.pageSize()));
  });

  protected readonly pagedRows = computed(() => {
    const rows = this.sortedRows();

    if (!this.enablePagination()) {
      return rows;
    }

    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();

    return rows.slice(start, end);
  });

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

    visit(this.pagedRows(), 0);
    return result;
  });

  protected readonly paginationStart = computed(() => {
    if (!this.enablePagination() || this.totalTopLevelRows() === 0) {
      return 0;
    }

    return this.pageIndex() * this.pageSize() + 1;
  });

  protected readonly paginationEnd = computed(() => {
    if (!this.enablePagination() || this.totalTopLevelRows() === 0) {
      return this.totalTopLevelRows();
    }

    return Math.min(
      (this.pageIndex() + 1) * this.pageSize(),
      this.totalTopLevelRows()
    );
  });

  constructor() {
    effect(() => {
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

    effect(() => {
      const options = this.pageSizeOptions();
      const preferred = this.defaultPageSize();
      const resolvedPageSize = options.includes(preferred)
        ? preferred
        : options[0] ?? 10;

      if (this.pageSize() !== resolvedPageSize) {
        this.pageSize.set(resolvedPageSize);
      }
    });

    effect(() => {
      const totalPages = this.totalPages();
      const currentPage = this.pageIndex();

      if (currentPage > totalPages - 1) {
        this.pageIndex.set(Math.max(0, totalPages - 1));
      }
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

  protected isColumnSortable(column: ReportTableColumn): boolean {
    return !!column.sortable;
  }

  protected toggleColumnSort(column: ReportTableColumn): void {
    if (!column.sortable) {
      return;
    }

    const current = this.sortState();

    if (!current || current.mode !== 'column' || current.key !== column.key) {
      this.sortState.set({
        mode: 'column',
        key: column.key,
        direction: 'asc',
      });
      this.pageIndex.set(0);
      return;
    }

    if (current.direction === 'asc') {
      this.sortState.set({
        ...current,
        direction: 'desc',
      });
      this.pageIndex.set(0);
      return;
    }

    this.sortState.set(null);
    this.pageIndex.set(0);
  }

  protected toggleDistributionSort(
    segment: ReportTableDistributionSegment
  ): void {
    const current = this.sortState();

    if (
      !current ||
      current.mode !== 'distribution' ||
      current.key !== segment.key
    ) {
      this.sortState.set({
        mode: 'distribution',
        key: segment.key,
        direction: 'asc',
      });
      this.pageIndex.set(0);
      return;
    }

    if (current.direction === 'asc') {
      this.sortState.set({
        ...current,
        direction: 'desc',
      });
      this.pageIndex.set(0);
      return;
    }

    this.sortState.set(null);
    this.pageIndex.set(0);
  }

  protected getColumnSortDirection(
    column: ReportTableColumn
  ): ReportTableSortDirection | null {
    const state = this.sortState();

    if (!state || state.mode !== 'column' || state.key !== column.key) {
      return null;
    }

    return state.direction;
  }

  protected getDistributionSortDirection(
    segment: ReportTableDistributionSegment
  ): ReportTableSortDirection | null {
    const state = this.sortState();

    if (!state || state.mode !== 'distribution' || state.key !== segment.key) {
      return null;
    }

    return state.direction;
  }

  protected getSortIcon(
    direction: ReportTableSortDirection | null
  ): 'fa-arrow-up' | 'fa-arrow-down' | 'fa-minus' {
    if (direction === 'asc') {
      return 'fa-arrow-up';
    }

    if (direction === 'desc') {
      return 'fa-arrow-down';
    }

    return 'fa-minus';
  }

  protected goToPreviousPage(): void {
    if (this.pageIndex() === 0) {
      return;
    }

    this.pageIndex.update((value) => value - 1);
  }

  protected goToNextPage(): void {
    if (this.pageIndex() >= this.totalPages() - 1) {
      return;
    }

    this.pageIndex.update((value) => value + 1);
  }

  protected setPageSize(size: string | number): void {
    const parsedSize =
      typeof size === 'number' ? size : Number.parseInt(size, 10);

    if (!Number.isFinite(parsedSize) || parsedSize <= 0) {
      return;
    }

    this.pageSize.set(parsedSize);
    this.pageIndex.set(0);
  }

  protected trackByVisibleRow = (
    _: number,
    item: { row: ReportTableRow; level: number }
  ) => item.row.id;

  private sortRows(rows: ReportTableRow[]): ReportTableRow[] {
    const state = this.sortState();

    const clonedRows = rows.map((row) => ({
      ...row,
      children: row.children?.length
        ? this.sortRows(row.children)
        : row.children,
    }));

    if (!state) {
      return clonedRows;
    }

    return [...clonedRows].sort((a, b) => {
      const result = this.compareRows(a, b, state);
      return state.direction === 'asc' ? result : -result;
    });
  }

  private compareRows(
    a: ReportTableRow,
    b: ReportTableRow,
    state: ReportTableSortState
  ): number {
    if (state.mode === 'distribution') {
      const aValue = this.getDistributionSortValue(a, state.key);
      const bValue = this.getDistributionSortValue(b, state.key);

      return this.comparePrimitiveValues(aValue, bValue);
    }

    const aValue = this.getColumnSortValue(a, state.key);
    const bValue = this.getColumnSortValue(b, state.key);

    return this.comparePrimitiveValues(aValue, bValue);
  }

  private getColumnSortValue(
    row: ReportTableRow,
    key: string
  ): string | number {
    const distributionSegment = row.distributionSegments?.find(
      (segment) => segment.key === key
    );

    if (distributionSegment) {
      return this.valueDisplayMode() === 'percentage'
        ? distributionSegment.percentage
        : distributionSegment.value;
    }

    const value = row.values[key];

    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();

      if (trimmed.endsWith('%')) {
        const numeric = Number.parseFloat(trimmed.replace('%', ''));

        if (!Number.isNaN(numeric)) {
          return numeric;
        }
      }

      return trimmed.toLocaleLowerCase();
    }

    return '';
  }

  private getDistributionSortValue(row: ReportTableRow, key: string): number {
    const segment = row.distributionSegments?.find(
      (item) => item.key === key || item.label === key
    );

    if (!segment) {
      return 0;
    }

    return this.valueDisplayMode() === 'percentage'
      ? segment.percentage
      : segment.value;
  }

  private comparePrimitiveValues(
    a: string | number,
    b: string | number
  ): number {
    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }

    return String(a).localeCompare(String(b), undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  }
}
