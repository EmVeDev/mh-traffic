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
  createAudiencesBreakdownOptions,
  createPrimaryReportMetricOptions,
} from '../shared/report-filter-options';
import { AudiencesReportPageDataStore } from './audiences-report-page.data-store';

@Injectable()
export class AudiencesReportPageStore {
  private readonly data = inject(AudiencesReportPageDataStore);
  readonly base = createReportBaseStore();
  readonly title = 'Audiences report';
  readonly overviewTitle = 'How audiences generate pageviews';

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
          '/content/audiences'
        )
      )
  );

  readonly tableTotals = computed(() =>
    createSimpleTotals(this.data.rows(), this.base.valueDisplayMode())
  );

  constructor() {
    this.base.metricOptions.set(createPrimaryReportMetricOptions());
    this.base.selectedMetricValue.set(
      this.base.metricOptions()[0]?.value ?? ''
    );

    this.base.breakdownOptions.set(createAudiencesBreakdownOptions());
    this.base.selectedBreakdownValue.set(
      this.base.breakdownOptions()[0]?.value ?? ''
    );
  }
}
