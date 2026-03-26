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
  createSectionsBreakdownOptions,
  createSimpleMetricOptions,
} from '../shared/report-filter-options';
import { SectionsReportPageDataStore } from './sections-report-page.data-store';

@Injectable()
export class SectionsReportPageStore {
  private readonly data = inject(SectionsReportPageDataStore);
  readonly base = createReportBaseStore();
  readonly title = 'Sections report';
  readonly overviewTitle = 'How sections generate pageviews';

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
          '/content/sections'
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

    this.base.breakdownOptions.set(createSectionsBreakdownOptions());
    this.base.selectedBreakdownValue.set(
      this.base.breakdownOptions()[0]?.value ?? ''
    );
  }
}
