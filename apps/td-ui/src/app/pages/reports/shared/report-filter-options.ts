import type { ReportSiteOption } from '../../../features/report-page-header/report-page-header.component';
import type { ReportToolbarOption } from '../../../features/report-toolbar/report-toolbar.component';

export function createDefaultReportSiteOptions(): ReportSiteOption[] {
  return [
    {
      value: 'nieuwsblad.be',
      label: 'nieuwsblad.be',
      leadingLabel: 'N',
      leadingClass: 'site-trigger-brand--nb',
    },
    {
      value: 'standaard.be',
      label: 'standaard.be',
      leadingLabel: 'DS',
      leadingClass: 'site-trigger-brand--ds',
    },
    {
      value: 'gva.be',
      label: 'gva.be',
      leadingLabel: 'GVA',
      leadingClass: 'site-trigger-brand--gva',
    },
    {
      value: 'hbvl.be',
      label: 'hbvl.be',
      leadingLabel: 'C',
      leadingClass: 'site-trigger-brand--hbvl',
    },
  ];
}

export function createPrimaryReportMetricOptions(): ReportToolbarOption[] {
  return [
    { value: 'pageviews', label: 'Pageviews' },
    { value: 'reads', label: 'Reads' },
    { value: 'attention-time', label: 'Attention Time' },
  ];
}

export function createSimpleMetricOptions(): ReportToolbarOption[] {
  return createPrimaryReportMetricOptions();
}

export function createSharedReportBreakdownOptions(): ReportToolbarOption[] {
  return [
    { value: 'main-metrics', label: 'main metrics' },
    { value: 'reading-quality', label: 'reading quality' },
    { value: 'referrers', label: 'referrers' },
    { value: 'audiences', label: 'audiences' },
    { value: 'applications', label: 'applications' },
    { value: 'devices', label: 'devices' },
    { value: 'conversions', label: 'conversions' },
  ];
}

export function createApplicationsBreakdownOptions(): ReportToolbarOption[] {
  return createSharedReportBreakdownOptions();
}

export function createSectionsBreakdownOptions(): ReportToolbarOption[] {
  return createSharedReportBreakdownOptions();
}

export function createArticlesBreakdownOptions(): ReportToolbarOption[] {
  return createSharedReportBreakdownOptions();
}

export function createReferrersBreakdownOptions(): ReportToolbarOption[] {
  return createSharedReportBreakdownOptions();
}

export function createAudiencesBreakdownOptions(): ReportToolbarOption[] {
  return createSharedReportBreakdownOptions();
}
