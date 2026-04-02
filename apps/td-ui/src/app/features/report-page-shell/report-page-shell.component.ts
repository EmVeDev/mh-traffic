import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  viewChild,
} from '@angular/core';
import {
  MhdChartConfig,
  MhdDateRangeValue,
  MhdIconComponent,
  MhdReportOverviewComponent,
  MhdReportTableComponent,
} from '@mh-traffic/mh-design';
import {
  ReportPageHeaderComponent,
  ReportSiteOption,
} from '../report-page-header/report-page-header.component';
import {
  ReportToolbarComponent,
  ReportToolbarOption,
  ReportToolbarShareAction,
} from '../report-toolbar/report-toolbar.component';
import type {
  ReportOverviewGroup,
  ReportTableColumn,
  ReportTableRow,
} from '@mh-traffic/mh-design';

export interface ReportTableTotals {
  name: string;
  values: Record<string, string | number>;
}

@Component({
  selector: 'td-report-page-shell',
  standalone: true,
  imports: [
    ReportPageHeaderComponent,
    ReportToolbarComponent,
    MhdReportOverviewComponent,
    MhdReportTableComponent,
    MhdIconComponent,
  ],
  templateUrl: './report-page-shell.component.html',
  styleUrl: './report-page-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportPageShellComponent {
  private readonly reportOverview = viewChild(MhdReportOverviewComponent);

  readonly title = input.required<string>();
  readonly overviewTitle = input.required<string>();
  readonly tableTitle = input.required<string>();
  readonly firstColumnHeader = input.required<string>();

  readonly siteOptions = input.required<ReportSiteOption[]>();
  readonly selectedSiteValue = input.required<string>();

  readonly dateRangeValue = input.required<MhdDateRangeValue>();
  readonly analysisTypeLabel = input.required<string>();
  readonly selectedDateLabel = input.required<string>();

  readonly metricOptions = input.required<ReportToolbarOption[]>();
  readonly selectedMetricValue = input.required<string>();
  readonly breakdownOptions = input.required<ReportToolbarOption[]>();
  readonly selectedBreakdownValue = input.required<string>();

  readonly advancedFiltersOpen = input.required<boolean>();

  readonly toolbarLeadingLabel = input<string>('');

  readonly overviewLeftGroups = input.required<ReportOverviewGroup[]>();
  readonly overviewRightGroups = input.required<ReportOverviewGroup[]>();
  readonly overviewChart = input<MhdChartConfig | null>(null);

  readonly columns = input.required<ReportTableColumn[]>();
  readonly rows = input.required<ReportTableRow[]>();
  readonly totals = input<ReportTableTotals | null>(null);

  readonly tableDisplayMode = input.required<'chart' | 'table'>();
  readonly enableTablePagination = input<boolean>(true);
  readonly valueDisplayMode = input.required<'raw' | 'percentage'>();

  readonly enableTableModeToggle = input(false);
  readonly enableValueModeToggle = input(false);

  readonly siteSelected = output<string>();
  readonly dateRangeValueChange = output<MhdDateRangeValue>();
  readonly metricSelected = output<string>();
  readonly breakdownSelected = output<string>();
  readonly filterToggle = output<void>();
  readonly tableModeChange = output<'chart' | 'table'>();
  readonly valueModeChange = output<'raw' | 'percentage'>();
  readonly shareActionSelected = output<ReportToolbarShareAction>();

  protected readonly resolvedToolbarLeadingLabel = computed(() => {
    const explicit = this.toolbarLeadingLabel();
    if (explicit) {
      return explicit;
    }

    return this.dateRangeValue().mode === 'range' ? 'Multi-day' : 'Single-day';
  });

  protected onSiteSelected(value: string): void {
    this.siteSelected.emit(value);
  }

  protected onDateRangeValueChange(value: MhdDateRangeValue): void {
    this.dateRangeValueChange.emit(value);
  }

  protected onMetricSelected(value: string): void {
    this.metricSelected.emit(value);
  }

  protected onBreakdownSelected(value: string): void {
    this.breakdownSelected.emit(value);
  }

  protected onFilterToggle(): void {
    this.filterToggle.emit();
  }

  protected setTableMode(mode: 'chart' | 'table'): void {
    this.tableModeChange.emit(mode);
  }

  protected setValueMode(mode: 'raw' | 'percentage'): void {
    this.valueModeChange.emit(mode);
  }

  protected async onShareActionSelected(
    action: ReportToolbarShareAction
  ): Promise<void> {
    switch (action) {
      case 'share-chart-image':
      case 'download-chart-image':
        await this.reportOverview()?.exportChartAsPng(
          this.buildChartExportFilename()
        );
        return;

      default:
        this.shareActionSelected.emit(action);
    }
  }

  private buildChartExportFilename(): string {
    return this.overviewTitle()
      .toLowerCase()
      .replace(/<[^>]+>/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
