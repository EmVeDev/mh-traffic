import { ReportTableColumn } from '@mh-traffic/mh-design';

export type ReportColumnKey =
  | 'articles'
  | 'pageviews'
  | 'www'
  | 'newsApp'
  | 'digiPaperApp';

export const ARTICLES_COLUMN: Readonly<ReportTableColumn> = {
  key: 'articles',
  label: 'articles',
  align: 'right',
  type: 'number',
  sortable: true,
};

export const PAGEVIEWS_COLUMN: Readonly<ReportTableColumn> = {
  key: 'pageviews',
  label: 'pageviews',
  align: 'right',
  type: 'number',
  tooltip: 'Total pageviews for the selected filters',
  sortable: true,
};

export const WWW_COLUMN: Readonly<ReportTableColumn> = {
  key: 'www',
  label: 'www',
  align: 'right',
  type: 'number',
  sortable: true,
};

export const NEWS_APP_COLUMN: Readonly<ReportTableColumn> = {
  key: 'newsApp',
  label: 'news-app',
  align: 'right',
  type: 'number',
  sortable: true,
};

export const DIGI_PAPER_APP_COLUMN: Readonly<ReportTableColumn> = {
  key: 'digiPaperApp',
  label: 'digipaper-app',
  align: 'right',
  type: 'number',
  sortable: true,
};

export const APPLICATION_COLUMNS: readonly ReportTableColumn[] = [
  WWW_COLUMN,
  NEWS_APP_COLUMN,
  DIGI_PAPER_APP_COLUMN,
];

export const TAG_REPORT_CHART_COLUMNS: readonly ReportTableColumn[] = [
  ARTICLES_COLUMN,
  PAGEVIEWS_COLUMN,
];

export const TAG_REPORT_TABLE_COLUMNS: readonly ReportTableColumn[] = [
  ARTICLES_COLUMN,
  PAGEVIEWS_COLUMN,
  ...APPLICATION_COLUMNS,
];

export const TAG_DETAIL_TABLE_COLUMNS: readonly ReportTableColumn[] = [
  PAGEVIEWS_COLUMN,
  ...APPLICATION_COLUMNS,
];

export const SECTION_DETAIL_TABLE_COLUMNS: readonly ReportTableColumn[] = [
  PAGEVIEWS_COLUMN,
  ...APPLICATION_COLUMNS,
];
