import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { ReportOverviewGroup, ReportTableColumn, ReportTableRow } from '@mh-traffic/mh-design';
import { MhdDateRangeValue, MhdReportOverviewComponent, MhdReportTableComponent } from '@mh-traffic/mh-design';
import { ReportPageHeaderComponent, ReportSiteOption } from '../report-page-header/report-page-header.component';
import { ReportToolbarComponent, ReportToolbarOption } from '../report-toolbar/report-toolbar.component';

@Component({
  selector: 'td-report-page-shell',
  standalone: true,
  imports: [
    ReportPageHeaderComponent,
    ReportToolbarComponent,
    MhdReportOverviewComponent,
    MhdReportTableComponent,
  ],
  templateUrl: './report-page-shell.component.html',
  styleUrl: './report-page-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportPageShellComponent {
  readonly title = input.required<string>();
  readonly overviewTitle = input.required<string>();

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

  readonly overviewLeftGroups = input.required<ReportOverviewGroup[]>();
  readonly overviewRightGroups = input.required<ReportOverviewGroup[]>();

  readonly columns = input.required<ReportTableColumn[]>();
  readonly rows = input.required<ReportTableRow[]>();
  readonly totals = input.required<{
    name: string;
    values: Record<string, string | number>;
  }>();

  readonly tableDisplayMode = input.required<'chart' | 'table'>();
  readonly valueDisplayMode = input.required<'raw' | 'percentage'>();

  readonly siteSelected = output<string>();
  readonly dateRangeValueChange = output<MhdDateRangeValue>();
  readonly metricSelected = output<string>();
  readonly breakdownSelected = output<string>();
  readonly filterToggle = output<void>();
  readonly tableModeChange = output<'chart' | 'table'>();
  readonly valueModeChange = output<'raw' | 'percentage'>();

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
}
