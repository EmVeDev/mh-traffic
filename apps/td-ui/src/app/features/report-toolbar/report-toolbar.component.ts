import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import {
  MhdButtonComponent,
  MhdDropdownComponent,
  MhdIconComponent,
} from '@mh-traffic/mh-design';
import {
  ReportToolbarOption,
  ReportToolbarToken,
} from './report-toolbar.types';

export type {
  ReportToolbarOption,
  ReportToolbarToken,
} from './report-toolbar.types';

@Component({
  selector: 'td-report-toolbar',
  standalone: true,
  imports: [MhdButtonComponent, MhdDropdownComponent, MhdIconComponent],
  templateUrl: './report-toolbar.component.html',
  styleUrl: './report-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportToolbarComponent {
  // New API
  readonly analysisTypeLabel = input<string>('');
  readonly metricOptions = input<ReportToolbarOption[]>([]);
  readonly selectedMetricValue = input<string>('');
  readonly breakdownOptions = input<ReportToolbarOption[]>([]);
  readonly selectedBreakdownValue = input<string>('');
  readonly advancedFiltersOpen = input(false);

  // Legacy API
  readonly tokens = input<ReportToolbarToken[]>([]);
  readonly middleLabel = input<string>('');

  readonly metricSelected = output<string>();
  readonly breakdownSelected = output<string>();
  readonly filterToggle = output<void>();

  protected readonly metricDropdownOpen = signal(false);
  protected readonly breakdownDropdownOpen = signal(false);

  protected readonly usesLegacyMode = computed(
    () => this.tokens().length > 0 || !!this.middleLabel()
  );

  protected readonly legacyAnalysisLabel = computed(() => {
    const activeToken = this.tokens().find((token) => token.active);
    return (
      activeToken?.label ??
      this.tokens()[0]?.label ??
      this.analysisTypeLabel() ??
      ''
    );
  });

  protected readonly legacyBreakdownLabel = computed(() => {
    if (this.middleLabel()) {
      const nonActiveToken = this.tokens().find((token) => !token.active);
      return nonActiveToken?.label ?? '';
    }

    return '';
  });

  protected selectedMetricLabel(): string {
    return (
      this.metricOptions().find(
        (option) => option.value === this.selectedMetricValue()
      )?.label ?? ''
    );
  }

  protected selectedBreakdownLabel(): string {
    return (
      this.breakdownOptions().find(
        (option) => option.value === this.selectedBreakdownValue()
      )?.label ?? ''
    );
  }

  protected selectMetric(value: string): void {
    this.metricSelected.emit(value);
    this.metricDropdownOpen.set(false);
  }

  protected selectBreakdown(value: string): void {
    this.breakdownSelected.emit(value);
    this.breakdownDropdownOpen.set(false);
  }
}
