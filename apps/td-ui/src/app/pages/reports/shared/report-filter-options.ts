import { ReportSiteOption } from '../../../features/report-page-header/report-page-header.component';
import { ReportToolbarOption } from '../../../features/report-toolbar/report-toolbar.component';

export function createDefaultReportSiteOptions(): ReportSiteOption[] {
  return [
    {
      value: 'nieuwsblad.be',
      label: 'nieuwsblad.be',
      brandText: 'N',
      brandClass: 'site-trigger-brand--nb',
    },
    {
      value: 'standaard.be',
      label: 'standaard.be',
      brandText: 'DS',
      brandClass: 'site-trigger-brand--ds',
    },
    {
      value: 'gva.be',
      label: 'gva.be',
      brandText: 'GVA',
      brandClass: 'site-trigger-brand--gva',
    },
    {
      value: 'hbvl.be',
      label: 'hbvl.be',
      brandText: 'C',
      brandClass: 'site-trigger-brand--hbvl',
    },
  ];
}

export function createPrimaryReportMetricOptions(): ReportToolbarOption[] {
  return [
    { value: 'pageviews', label: 'pageviews' },
    { value: 'reads', label: 'reads' },
    { value: 'attention-time', label: 'attention time' },
  ];
}

export function createSimpleMetricOptions(): ReportToolbarOption[] {
  return [
    { value: 'pageviews', label: 'pageviews' },
    { value: 'reads', label: 'reads' },
  ];
}

export function createApplicationsBreakdownOptions(): ReportToolbarOption[] {
  return [
    { value: 'applications', label: 'applications' },
    { value: 'main-metrics', label: 'main metrics' },
    { value: 'platform', label: 'platform' },
  ];
}

export function createSectionsBreakdownOptions(): ReportToolbarOption[] {
  return [
    { value: 'sections', label: 'sections' },
    { value: 'platform', label: 'platform' },
  ];
}

export function createArticlesBreakdownOptions(): ReportToolbarOption[] {
  return [
    { value: 'articles', label: 'articles' },
    { value: 'platform', label: 'platform' },
  ];
}

export function createReferrersBreakdownOptions(): ReportToolbarOption[] {
  return [
    { value: 'referrers', label: 'referrers' },
    { value: 'platform', label: 'platform' },
  ];
}

export function createAudiencesBreakdownOptions(): ReportToolbarOption[] {
  return [
    { value: 'audiences', label: 'audiences' },
    { value: 'platform', label: 'platform' },
  ];
}
