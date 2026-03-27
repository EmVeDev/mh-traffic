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

export function createApplicationsBreakdownOptions(): ReportToolbarOption[] {
  return [
    { value: 'applications', label: 'applications' },
    { value: 'platform', label: 'platform' },
    { value: 'product', label: 'product' },
  ];
}

export function createSectionsBreakdownOptions(): ReportToolbarOption[] {
  return [
    { value: 'sections', label: 'sections' },
    { value: 'subsections', label: 'subsections' },
    { value: 'articles', label: 'articles' },
  ];
}

export function createArticlesBreakdownOptions(): ReportToolbarOption[] {
  return [
    { value: 'articles', label: 'articles' },
    { value: 'authors', label: 'authors' },
    { value: 'tags', label: 'tags' },
  ];
}

export function createReferrersBreakdownOptions(): ReportToolbarOption[] {
  return [
    { value: 'referrers', label: 'referrers' },
    { value: 'referrer-groups', label: 'referrer groups' },
    { value: 'articles', label: 'articles' },
  ];
}

export function createAudiencesBreakdownOptions(): ReportToolbarOption[] {
  return [
    { value: 'audiences', label: 'audiences' },
    { value: 'audience-type', label: 'audience type' },
    { value: 'subscription-status', label: 'subscription status' },
  ];
}
