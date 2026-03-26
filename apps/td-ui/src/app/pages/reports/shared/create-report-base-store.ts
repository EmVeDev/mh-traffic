import { computed, signal } from '@angular/core';
import {
  MhdDateRangeValue,
  MhdMultiSelectOption,
  MhdSelectOption,
} from '@mh-traffic/mh-design';

import {
  createDefaultSingleDayValue,
  getAnalysisTypeLabelFromDateRange,
  getDateLabelFromDateRange,
} from './report-date';
import {
  createDefaultReportSiteOptions,
  createPrimaryReportMetricOptions,
  createSharedReportBreakdownOptions,
} from './report-filter-options';
import {
  createAudienceTypeOptions,
  createPlatformOptions,
  createProductOptions,
  createReferrerOptions,
} from './report-advanced-filter-options';

export interface ReportBaseFilterState {
  site: string;
  dateRange: MhdDateRangeValue;
  dateMode: 'single-day' | 'multi-day';
  metric: string;
  breakdown: string;
}

export function createReportBaseStore() {
  // core filters
  const siteOptions = signal(createDefaultReportSiteOptions());
  const selectedSiteValue = signal(siteOptions()[0]?.value ?? '');

  const dateRangeValue = signal(createDefaultSingleDayValue());

  const analysisTypeLabel = computed(() =>
    getAnalysisTypeLabelFromDateRange(dateRangeValue())
  );

  const selectedDateLabel = computed(() =>
    getDateLabelFromDateRange(dateRangeValue())
  );

  const toolbarLeadingLabel = computed(() =>
    dateRangeValue().mode === 'range' ? 'Multi-day' : 'Single-day'
  );

  const metricOptions = signal(createPrimaryReportMetricOptions());
  const breakdownOptions = signal(createSharedReportBreakdownOptions());

  const selectedMetricValue = signal(metricOptions()[0]?.value ?? '');
  const selectedBreakdownValue = signal(breakdownOptions()[0]?.value ?? '');

  const baseFilter = computed<ReportBaseFilterState>(() => ({
    site: selectedSiteValue(),
    dateRange: dateRangeValue(),
    dateMode: dateRangeValue().mode === 'range' ? 'multi-day' : 'single-day',
    metric: selectedMetricValue(),
    breakdown: selectedBreakdownValue(),
  }));

  // advanced filters
  const advancedFiltersOpen = signal(false);

  const platformOptions = signal<MhdMultiSelectOption[]>(
    createPlatformOptions()
  );
  const productOptions = signal<MhdSelectOption[]>(createProductOptions());
  const referrerOptions = signal<MhdSelectOption[]>(createReferrerOptions());
  const audienceTypeOptions = signal<MhdSelectOption[]>(
    createAudienceTypeOptions()
  );

  const selectedPlatforms = signal<string[]>([]);
  const productValue = signal('all');
  const referrerValue = signal('all');
  const audienceTypeValue = signal('all');
  const includeSubscriberOnly = signal(false);

  const advancedFilter = computed(() => ({
    platforms: selectedPlatforms(),
    product: productValue(),
    referrer: referrerValue(),
    audienceType: audienceTypeValue(),
    subscriberOnly: includeSubscriberOnly(),
  }));

  const filterState = computed(() => ({
    ...baseFilter(),
    ...advancedFilter(),
  }));

  // table modes
  const valueDisplayMode = signal<'raw' | 'percentage'>('raw');
  const tableDisplayMode = signal<'chart' | 'table'>('table');

  // actions
  function setSelectedSite(value: string) {
    selectedSiteValue.set(value);
  }

  function setDateRangeValue(value: MhdDateRangeValue) {
    dateRangeValue.set(value);
  }

  function setSelectedMetric(value: string) {
    selectedMetricValue.set(value);
  }

  function setSelectedBreakdown(value: string) {
    selectedBreakdownValue.set(value);
  }

  function toggleAdvancedFilters() {
    advancedFiltersOpen.update((value) => !value);
  }

  function setSelectedPlatforms(values: string[]) {
    selectedPlatforms.set(values);
  }

  function setProductValue(value: string) {
    productValue.set(value);
  }

  function setReferrerValue(value: string) {
    referrerValue.set(value);
  }

  function setAudienceTypeValue(value: string) {
    audienceTypeValue.set(value);
  }

  function setIncludeSubscriberOnly(value: boolean) {
    includeSubscriberOnly.set(value);
  }

  function clearAdvancedFilters() {
    selectedPlatforms.set([]);
    productValue.set('all');
    referrerValue.set('all');
    audienceTypeValue.set('all');
    includeSubscriberOnly.set(false);
  }

  function applyAdvancedFilters() {
    advancedFiltersOpen.set(false);
  }

  function setValueDisplayMode(mode: 'raw' | 'percentage') {
    valueDisplayMode.set(mode);
  }

  function setTableDisplayMode(mode: 'chart' | 'table') {
    tableDisplayMode.set(mode);
  }

  return {
    // shared state
    siteOptions,
    selectedSiteValue,
    dateRangeValue,
    analysisTypeLabel,
    selectedDateLabel,
    toolbarLeadingLabel,

    metricOptions,
    breakdownOptions,
    selectedMetricValue,
    selectedBreakdownValue,

    advancedFiltersOpen,

    platformOptions,
    productOptions,
    referrerOptions,
    audienceTypeOptions,

    selectedPlatforms,
    productValue,
    referrerValue,
    audienceTypeValue,
    includeSubscriberOnly,

    valueDisplayMode,
    tableDisplayMode,

    baseFilter,
    advancedFilter,
    filterState,

    // actions
    setSelectedSite,
    setDateRangeValue,
    setSelectedMetric,
    setSelectedBreakdown,
    toggleAdvancedFilters,
    setSelectedPlatforms,
    setProductValue,
    setReferrerValue,
    setAudienceTypeValue,
    setIncludeSubscriberOnly,
    clearAdvancedFilters,
    applyAdvancedFilters,
    setValueDisplayMode,
    setTableDisplayMode,
  };
}
