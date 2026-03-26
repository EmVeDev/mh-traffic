import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  MhdDateRangeSelectComponent,
  MhdDateRangeValue,
  MhdSelectComponent,
  MhdSelectOption,
} from '@mh-traffic/mh-design';

export interface ReportSiteOption extends MhdSelectOption {
  leadingLabel?: string;
  leadingClass?: string;
}

@Component({
  selector: 'td-report-page-header',
  standalone: true,
  imports: [MhdSelectComponent, MhdDateRangeSelectComponent],
  templateUrl: './report-page-header.component.html',
  styleUrl: './report-page-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportPageHeaderComponent {
  readonly title = input.required<string>();

  readonly sites = input.required<ReportSiteOption[]>();
  readonly selectedSiteValue = input.required<string>();

  readonly analysisTypeLabel = input.required<string>();
  readonly selectedDateLabel = input.required<string>();
  readonly dateRangeValue = input.required<MhdDateRangeValue>();

  readonly siteSelected = output<string>();
  readonly dateRangeValueChange = output<MhdDateRangeValue>();

  protected onSiteSelected(value: string): void {
    this.siteSelected.emit(value);
  }

  protected onDateRangeChanged(value: MhdDateRangeValue): void {
    this.dateRangeValueChange.emit(value);
  }
}
