import { computed, inject, Injectable } from '@angular/core';
import { ReportTableRow } from '@mh-traffic/mh-design';
import {
  createTagReportOverviewLeftGroups,
  createTagReportOverviewRightGroups,
} from '../shared/report-overview-factories';
import {
  TAG_REPORT_CHART_COLUMNS,
  TAG_REPORT_TABLE_COLUMNS,
} from '../shared/report-table-columns';
import {
  buildDistribution,
  flattenTagsRows,
  mapTagsRowToReportRow,
} from '../shared/report-table-mappers';
import { createReportBaseStore } from '../shared/create-report-base-store';
import { TagsReportPageDataStore } from './tags-report-page.data-store';

@Injectable()
export class TagsReportPageStore {
  private readonly data = inject(TagsReportPageDataStore);
  readonly base = createReportBaseStore();

  readonly title = 'Tags report';

  readonly tableColumns = computed(() =>
    this.base.tableDisplayMode() === 'chart'
      ? [...TAG_REPORT_CHART_COLUMNS]
      : [...TAG_REPORT_TABLE_COLUMNS]
  );

  readonly overviewLeftGroups = computed(() =>
    createTagReportOverviewLeftGroups()
  );
  readonly overviewRightGroups = computed(() =>
    createTagReportOverviewRightGroups()
  );

  readonly tableRows = computed<ReportTableRow[]>(() =>
    this.data
      .rows()
      .map((row) => mapTagsRowToReportRow(row, this.base.valueDisplayMode()))
  );

  readonly tableTotals = computed(() => {
    const flattened = flattenTagsRows(this.data.rows());

    const articles = flattened.reduce((sum, row) => sum + row.articles, 0);
    const pageviews = flattened.reduce((sum, row) => sum + row.pageviews, 0);
    const www = flattened.reduce((sum, row) => sum + row.www, 0);
    const newsApp = flattened.reduce((sum, row) => sum + row.newsApp, 0);
    const digiPaperApp = flattened.reduce(
      (sum, row) => sum + row.digiPaperApp,
      0
    );

    const distribution = buildDistribution(www, newsApp, digiPaperApp);

    return {
      name: 'Totals',
      values: {
        articles,
        pageviews,
        www:
          this.base.valueDisplayMode() === 'raw'
            ? www
            : distribution[0].percentageLabel,
        newsApp:
          this.base.valueDisplayMode() === 'raw'
            ? newsApp
            : distribution[1].percentageLabel,
        digiPaperApp:
          this.base.valueDisplayMode() === 'raw'
            ? digiPaperApp
            : distribution[2].percentageLabel,
      },
      distributionSegments: distribution,
    };
  });
}
