import { computed, inject, Injectable } from '@angular/core';
import { createReportBaseStore } from '../shared/create-report-base-store';
import {
  createGenericOverviewLeftGroups,
  createGenericOverviewRightGroups,
  createSimpleTotals,
  mapSimpleRowToReportRow,
} from '../shared/simple-report-page-helpers';
import {
  TAG_DETAIL_TABLE_COLUMNS,
  TAG_REPORT_CHART_COLUMNS,
  TAG_REPORT_TABLE_COLUMNS,
} from '../shared/report-table-columns';
import {
  createArticlesBreakdownOptions,
  createSimpleMetricOptions,
} from '../shared/report-filter-options';
import { TagDetailPageDataStore } from './tag-detail-page.data-store';

@Injectable()
export class TagDetailPageStore {
  private readonly data = inject(TagDetailPageDataStore);

  readonly base = createReportBaseStore();

  readonly title = 'Tag detail';
  readonly overviewTitle = 'How articles in this tag generate pageviews';
  readonly tableTitle = 'Top articles in this tag';
  readonly firstColumnHeader = 'Article';

  readonly tableColumns = computed(() =>
    this.base.tableDisplayMode() === 'chart'
      ? [...TAG_REPORT_CHART_COLUMNS]
      : [...TAG_DETAIL_TABLE_COLUMNS]
  );

  readonly overviewLeftGroups = computed(() =>
    createGenericOverviewLeftGroups()
  );
  readonly overviewRightGroups = computed(() =>
    createGenericOverviewRightGroups()
  );

  readonly tableRows = computed(() =>
    this.data
      .rows()
      .map((row) =>
        mapSimpleRowToReportRow(
          row,
          this.base.valueDisplayMode(),
          '/content/tags'
        )
      )
  );

  readonly tableTotals = computed(() =>
    createSimpleTotals(this.data.rows(), this.base.valueDisplayMode())
  );

  constructor() {
    this.base.metricOptions.set(createSimpleMetricOptions());
    this.base.selectedMetricValue.set('pageviews');

    this.base.breakdownOptions.set(createArticlesBreakdownOptions());
    this.base.selectedBreakdownValue.set('articles');
  }
}
