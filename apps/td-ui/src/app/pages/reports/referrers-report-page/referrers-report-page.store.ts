import { computed, Injectable } from '@angular/core';
import type { ReportTableColumn, ReportTableRow } from '@mh-traffic/mh-design';
import { createReportBaseStore } from '../shared/create-report-base-store';
import {
  createGenericOverviewLeftGroups,
  createGenericOverviewRightGroups,
} from '../shared/simple-report-page-helpers';
import {
  createReferrersBreakdownOptions,
  createSimpleMetricOptions,
} from '../shared/report-filter-options';

@Injectable()
export class ReferrersReportPageStore {
  readonly base = createReportBaseStore();

  readonly title = 'Referrers report';
  readonly overviewTitle =
    'How articles in <strong>referrers</strong> generate <strong>pageviews</strong>';
  readonly tableTitle =
    'How do <strong>referrers</strong> differ when broken down by <strong>main metrics</strong>';
  readonly firstColumnHeader = 'Referrers';

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
      key: 'subscriber',
      label: 'Subscriber',
      align: 'right',
      type: 'number',
    },
    {
      key: 'registered',
      label: 'Registered',
      align: 'right',
      type: 'number',
    },
    {
      key: 'anonymous',
      label: 'Anonymous',
      align: 'right',
      type: 'number',
    },
  ]);

  readonly tableRows = computed<ReportTableRow[]>(() => [
    {
      id: 'internal-article',
      name: 'Internal - article',
      link: '/content/referrers/internal-article',
      values: {
        pageviews: 850987,
        subscriber: 509979,
        registered: 55418,
        anonymous: 285590,
      },
    },
    {
      id: 'internal-home',
      name: 'Internal - home',
      link: '/content/referrers/internal-home',
      values: {
        pageviews: 794090,
        subscriber: 468321,
        registered: 54746,
        anonymous: 271023,
      },
    },
    {
      id: 'google-discover',
      name: 'Google Discover',
      link: '/content/referrers/google-discover',
      values: {
        pageviews: 380169,
        subscriber: 41407,
        registered: 25503,
        anonymous: 313259,
      },
    },
    {
      id: 'newsletters',
      name: 'Newsletters',
      link: '/content/referrers/newsletters',
      values: {
        pageviews: 358896,
        subscriber: 140583,
        registered: 40373,
        anonymous: 177940,
      },
    },
    {
      id: 'facebook',
      name: 'Facebook',
      link: '/content/referrers/facebook',
      values: {
        pageviews: 238704,
        subscriber: 21719,
        registered: 12402,
        anonymous: 204583,
      },
    },
  ]);

  readonly tableTotals = computed(() => null);

  constructor() {
    this.base.metricOptions.set(createSimpleMetricOptions());
    this.base.selectedMetricValue.set('pageviews');

    this.base.breakdownOptions.set(createReferrersBreakdownOptions());
    this.base.selectedBreakdownValue.set('referrers');

    this.base.tableDisplayMode.set('table');
    this.base.valueDisplayMode.set('raw');
  }
}
