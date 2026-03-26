import { Injectable, computed, signal } from '@angular/core';
import { MhdDateRangeValue } from '@mh-traffic/mh-design';

import { createDefaultSingleDayValue } from '../shared/report-date';

export interface BaseReportFilter {
  site: string;
  dateRange: MhdDateRangeValue;
  dateMode: 'single-day' | 'multi-day';
  metric: string;
  breakdown: string;
}

@Injectable({ providedIn: 'root' })
export class ReportBaseStore {
  readonly selectedSiteValue = signal<string>('');
  readonly dateRangeValue = signal<MhdDateRangeValue>(
    createDefaultSingleDayValue()
  );

  readonly selectedMetricValue = signal<string>('');
  readonly selectedBreakdownValue = signal<string>('');

  readonly isSingleDay = computed(
    () => this.dateRangeValue().mode === 'single'
  );

  readonly toolbarLeadingLabel = computed(() =>
    this.isSingleDay() ? 'Single-day' : 'Multi-day'
  );

  readonly baseFilter = computed<BaseReportFilter>(() => ({
    site: this.selectedSiteValue(),
    dateRange: this.dateRangeValue(),
    dateMode: this.isSingleDay() ? 'single-day' : 'multi-day',
    metric: this.selectedMetricValue(),
    breakdown: this.selectedBreakdownValue(),
  }));

  setSite(value: string): void {
    this.selectedSiteValue.set(value);
  }

  setDateRange(value: MhdDateRangeValue): void {
    this.dateRangeValue.set(value);
  }

  setMetric(value: string): void {
    this.selectedMetricValue.set(value);
  }

  setBreakdown(value: string): void {
    this.selectedBreakdownValue.set(value);
  }
}
