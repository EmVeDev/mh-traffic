import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import {
  MhdDateRangeSelectComponent,
  MhdDateRangeValue,
  MhdSelectComponent,
  MhdSelectOption,
  MhdSelectTriggerComponent,
} from '@mh-traffic/mh-design';

export interface ReportSiteOption {
  value: string;
  label: string;
  brandText: string;
  brandClass: string;
}

@Component({
  selector: 'td-report-page-header',
  standalone: true,
  imports: [
    MhdDateRangeSelectComponent,
    MhdSelectComponent,
    MhdSelectTriggerComponent,
  ],
  templateUrl: './report-page-header.component.html',
  styleUrl: './report-page-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportPageHeaderComponent {
  readonly title = input.required<string>();

  readonly sites = input<ReportSiteOption[]>([]);
  readonly selectedSiteValue = input<string>('');
  readonly analysisTypeLabel = input<string>('');
  readonly selectedDateLabel = input<string>('');
  readonly dateRangeValue = input<MhdDateRangeValue | null>(null);

  readonly siteLabel = input<string>('');
  readonly analysisLabel = input<string>('');
  readonly dateLabel = input<string>('');

  readonly siteSelected = output<string>();
  readonly dateRangeValueChange = output<MhdDateRangeValue>();

  protected readonly resolvedAnalysisLabel = computed(() => {
    return this.analysisTypeLabel() || this.analysisLabel() || '';
  });

  protected readonly resolvedDateLabel = computed(() => {
    return this.selectedDateLabel() || this.dateLabel() || '';
  });

  protected readonly selectedSite = computed<ReportSiteOption | undefined>(
    () => {
      const sites = this.sites();
      const selectedValue = this.selectedSiteValue();

      if (sites.length && selectedValue) {
        return sites.find((site) => site.value === selectedValue);
      }

      if (sites.length && this.siteLabel()) {
        return sites.find((site) => site.label === this.siteLabel());
      }

      return undefined;
    }
  );

  protected readonly usesLegacySiteLabel = computed(() => {
    return !this.sites().length || !this.selectedSiteValue();
  });

  protected readonly resolvedSiteLabel = computed(() => {
    if (this.selectedSite()) {
      return this.selectedSite()?.label ?? '';
    }

    return this.siteLabel();
  });

  protected readonly showAnalysisLabel = computed(
    () => !!this.resolvedAnalysisLabel()
  );
  protected readonly showDateLabel = computed(() => {
    return !!this.dateRangeValue() || !!this.resolvedDateLabel();
  });

  protected readonly siteSelectOptions = computed<MhdSelectOption[]>(() =>
    this.sites().map((site) => ({
      value: site.value,
      label: site.label,
      leadingLabel: site.brandText,
      leadingClass: site.brandClass,
    }))
  );

  protected handleSiteValueChange(value: string): void {
    this.siteSelected.emit(value);
  }

  protected handleDateRangeValueChange(value: MhdDateRangeValue): void {
    this.dateRangeValueChange.emit(value);
  }
}
