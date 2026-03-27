import { computed, Injectable } from '@angular/core';
import type { ReportTableColumn, ReportTableRow } from '@mh-traffic/mh-design';
import { createReportBaseStore } from '../shared/create-report-base-store';
import {
  createGenericOverviewLeftGroups,
  createGenericOverviewRightGroups,
} from '../shared/simple-report-page-helpers';
import {
  createSectionsBreakdownOptions,
  createSimpleMetricOptions,
} from '../shared/report-filter-options';

@Injectable()
export class SectionsReportPageStore {
  readonly base = createReportBaseStore();

  readonly title = 'Sections report';
  readonly overviewTitle = computed(() => {
    const metric = this.base.selectedMetricValue();
    const breakdown = this.base.selectedBreakdownValue();
    return `How <strong>${breakdown}</strong> generate <strong>${metric}</strong>`;
  });
  readonly tableTitle = computed(() => {
    const metric = this.base.selectedMetricValue();
    const breakdown = this.base.selectedBreakdownValue();
    return `How do <strong>${breakdown}</strong> differ when broken down by <strong>${metric}</strong>`;
  });
  readonly firstColumnHeader = 'Top 30 sections';

  readonly overviewLeftGroups = computed(() =>
    createGenericOverviewLeftGroups()
  );
  readonly overviewRightGroups = computed(() =>
    createGenericOverviewRightGroups()
  );

  readonly tableColumns = computed<ReportTableColumn[]>(() => [
    {
      key: 'reads',
      label: 'Reads',
      align: 'right',
      type: 'number',
    },
    {
      key: 'subscriberAttention',
      label: 'Subscriber Attention',
      align: 'right',
    },
    {
      key: 'totalAttention',
      label: 'Total Attention',
      align: 'right',
    },
    {
      key: 'pageviews',
      label: 'Pageviews',
      align: 'right',
      type: 'number',
    },
  ]);

  readonly tableRows = computed<ReportTableRow[]>(() => [
    {
      id: 'nb-binnenland',
      name: 'nb/binnenland',
      link: '/content/sections/nb-binnenland',
      values: {
        reads: 513070,
        subscriberAttention: '332 802 min',
        totalAttention: '584 293 min',
        pageviews: 740975,
      },
    },
    {
      id: 'nb-politiek',
      name: 'nb/politiek',
      link: '/content/sections/nb-politiek',
      values: {
        reads: 236993,
        subscriberAttention: '195 557 min',
        totalAttention: '341 710 min',
        pageviews: 275961,
      },
    },
    {
      id: 'nb-buitenland',
      name: 'nb/buitenland',
      link: '/content/sections/nb-buitenland',
      values: {
        reads: 224795,
        subscriberAttention: '123 257 min',
        totalAttention: '232 717 min',
        pageviews: 247970,
      },
    },
    {
      id: 'nb-media-en-cultuur',
      name: 'nb/media-en-cultuur',
      link: '/content/sections/nb-media-en-cultuur',
      values: {
        reads: 185356,
        subscriberAttention: '142 015 min',
        totalAttention: '273 519 min',
        pageviews: 223994,
      },
    },
    {
      id: 'nb-economie',
      name: 'nb/economie',
      link: '/content/sections/nb-economie',
      values: {
        reads: 66436,
        subscriberAttention: '95 087 min',
        totalAttention: '123 008 min',
        pageviews: 196796,
      },
    },
  ]);

  readonly tableTotals = computed(() => null);

  constructor() {
    this.base.metricOptions.set(createSimpleMetricOptions());
    this.base.selectedMetricValue.set('reads');

    this.base.breakdownOptions.set(createSectionsBreakdownOptions());
    this.base.selectedBreakdownValue.set('sections');

    this.base.tableDisplayMode.set('table');
    this.base.valueDisplayMode.set('raw');
  }
}
