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
  MhdInlineSelectComponent,
} from '@mh-traffic/mh-design';
import {
  ReportToolbarOption,
  ReportToolbarToken,
} from './report-toolbar.types';

export type {
  ReportToolbarOption,
  ReportToolbarToken,
} from './report-toolbar.types';

export type ReportToolbarShareAction =
  | 'share-report'
  | 'share-chart-image'
  | 'share-metric-table'
  | 'download-report-pdf'
  | 'download-chart-image'
  | 'download-metric-table';

interface ReportToolbarShareOption {
  value: ReportToolbarShareAction;
  label: string;
  group: 'share' | 'download';
}

@Component({
  selector: 'td-report-toolbar',
  standalone: true,
  imports: [MhdButtonComponent, MhdDropdownComponent, MhdInlineSelectComponent],
  templateUrl: './report-toolbar.component.html',
  styleUrl: './report-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportToolbarComponent {
  readonly analysisTypeLabel = input<string>('');
  readonly leadingLabel = input<string>('');
  readonly metricOptions = input<ReportToolbarOption[]>([]);
  readonly selectedMetricValue = input<string>('');
  readonly breakdownOptions = input<ReportToolbarOption[]>([]);
  readonly selectedBreakdownValue = input<string>('');
  readonly advancedFiltersOpen = input<boolean>(false);

  readonly tokens = input<ReportToolbarToken[]>([]);
  readonly middleLabel = input<string>('');

  readonly metricSelected = output<string>();
  readonly breakdownSelected = output<string>();
  readonly filterToggle = output<void>();
  readonly shareActionSelected = output<ReportToolbarShareAction>();

  protected readonly shareDropdownOpen = signal(false);

  protected readonly shareOptions = computed<ReportToolbarShareOption[]>(() => [
    { value: 'share-report', label: 'Share this report', group: 'share' },
    { value: 'share-chart-image', label: 'Share chart image', group: 'share' },
    {
      value: 'share-metric-table',
      label: 'Share metric table (xls)',
      group: 'share',
    },
    {
      value: 'download-report-pdf',
      label: 'Download whole report as pdf',
      group: 'download',
    },
    {
      value: 'download-chart-image',
      label: 'Download chart image',
      group: 'download',
    },
    {
      value: 'download-metric-table',
      label: 'Download metric table (xls)',
      group: 'download',
    },
  ]);

  protected readonly shareGroups = computed(() => ({
    share: this.shareOptions().filter((option) => option.group === 'share'),
    download: this.shareOptions().filter(
      (option) => option.group === 'download'
    ),
  }));

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

  protected readonly resolvedLeadingLabel = computed(
    () => this.leadingLabel() || this.analysisTypeLabel()
  );

  protected selectMetric(value: string): void {
    this.metricSelected.emit(value);
  }

  protected selectBreakdown(value: string): void {
    this.breakdownSelected.emit(value);
  }

  protected selectShareAction(value: ReportToolbarShareAction): void {
    this.shareActionSelected.emit(value);
    this.shareDropdownOpen.set(false);
  }
}
