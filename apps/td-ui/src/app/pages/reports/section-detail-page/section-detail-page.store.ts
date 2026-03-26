import { computed, inject, Injectable } from '@angular/core';
import type { ReportTableRow } from '@mh-traffic/mh-design';
import { createReportBaseStore } from '../shared/create-report-base-store';
import {
  createGenericOverviewLeftGroups,
  createGenericOverviewRightGroups,
  createSimpleTotals,
  mapSimpleRowToReportRow,
} from '../shared/simple-report-page-helpers';
import {
  TAG_REPORT_CHART_COLUMNS,
  TAG_REPORT_TABLE_COLUMNS,
} from '../shared/report-table-columns';
import {
  createArticlesBreakdownOptions,
  createSimpleMetricOptions,
} from '../shared/report-filter-options';
import { SectionDetailPageDataStore } from './section-detail-page.data-store';

@Injectable()
export class SectionDetailPageStore {
  private readonly data = inject(SectionDetailPageDataStore);
  readonly base = createReportBaseStore();
  readonly title = 'Section detail';
  readonly overviewTitle = 'How articles in this section generate pageviews';

  readonly tableColumns = computed(() =>
    this.base.tableDisplayMode() === 'chart'
      ? [...TAG_REPORT_CHART_COLUMNS]
      : [...TAG_REPORT_TABLE_COLUMNS]
  );

  readonly overviewLeftGroups = computed(() =>
    createGenericOverviewLeftGroups()
  );
  readonly overviewRightGroups = computed(() =>
    createGenericOverviewRightGroups()
  );

  readonly tableRows = computed<ReportTableRow[]>(() =>
    this.data
      .rows()
      .map((row) =>
        mapSimpleRowToReportRow(
          row,
          this.base.valueDisplayMode(),
          '/content/articles'
        )
      )
  );

  readonly tableTotals = computed(() =>
    createSimpleTotals(this.data.rows(), this.base.valueDisplayMode())
  );

  constructor() {
    this.base.metricOptions.set(createSimpleMetricOptions());
    this.base.selectedMetricValue.set(
      this.base.metricOptions()[0]?.value ?? ''
    );

    this.base.breakdownOptions.set(createArticlesBreakdownOptions());
    this.base.selectedBreakdownValue.set(
      this.base.breakdownOptions()[0]?.value ?? ''
    );
  }
}
