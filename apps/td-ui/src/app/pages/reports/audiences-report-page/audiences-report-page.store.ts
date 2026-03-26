import { computed, Injectable } from '@angular/core';
import type { ReportTableColumn, ReportTableRow } from '@mh-traffic/mh-design';
import { createReportBaseStore } from '../shared/create-report-base-store';
import {
  createGenericOverviewLeftGroups,
  createGenericOverviewRightGroups,
} from '../shared/simple-report-page-helpers';
import {
  createAudiencesBreakdownOptions,
  createPrimaryReportMetricOptions,
} from '../shared/report-filter-options';

@Injectable()
export class AudiencesReportPageStore {
  readonly base = createReportBaseStore();

  readonly title = 'Audiences report';
  readonly overviewTitle = 'How audiences generate pageviews';
  readonly tableTitle =
    'How do audiences differ when broken down by main metrics';
  readonly firstColumnHeader = 'audiences';

  readonly overviewLeftGroups = computed(() =>
    createGenericOverviewLeftGroups()
  );
  readonly overviewRightGroups = computed(() =>
    createGenericOverviewRightGroups()
  );

  readonly tableColumns = computed<ReportTableColumn[]>(() => [
    {
      key: 'pageviews',
      label: 'Pageviews',
      align: 'right',
      type: 'number',
    },
    {
      key: 'totalAttention',
      label: 'Total Attention',
      align: 'right',
    },
    {
      key: 'reads',
      label: 'Reads',
      align: 'right',
      type: 'number',
    },
  ]);

  readonly tableRows = computed<ReportTableRow[]>(() => [
    {
      id: 'anonymous',
      name: 'Anonymous',
      link: '/content/audiences/anonymous',
      values: {
        pageviews: 513070,
        totalAttention: '584 293 min',
        reads: 740975,
      },
    },
    {
      id: 'registered',
      name: 'Registered',
      link: '/content/audiences/registered',
      values: {
        pageviews: 236993,
        totalAttention: '341 710 min',
        reads: 275961,
      },
    },
    {
      id: 'subscribers',
      name: 'Subscribers',
      link: '/content/audiences/subscribers',
      values: {
        pageviews: 224795,
        totalAttention: '232 717 min',
        reads: 247970,
      },
    },
  ]);

  readonly tableTotals = computed(() => null);

  constructor() {
    this.base.metricOptions.set(createPrimaryReportMetricOptions());
    this.base.selectedMetricValue.set('pageviews');

    this.base.breakdownOptions.set(createAudiencesBreakdownOptions());
    this.base.selectedBreakdownValue.set('audiences');

    this.base.tableDisplayMode.set('table');
    this.base.valueDisplayMode.set('raw');
  }
}
