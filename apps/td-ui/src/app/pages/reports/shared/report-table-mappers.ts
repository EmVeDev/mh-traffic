import {
  ReportTableDistributionSegment,
  ReportTableRow,
} from '@mh-traffic/mh-design';
import { TagsTableRowSource } from '../tags-report-page/tags-report-page.data-store';

export function mapTagsRowToReportRow(
  row: TagsTableRowSource,
  valueDisplayMode: 'raw' | 'percentage'
): ReportTableRow {
  const distribution = buildDistribution(
    row.www,
    row.newsApp,
    row.digiPaperApp
  );

  return {
    id: row.id,
    name: row.name,
    link: `/content/tags/${toSlug(row.name)}`,
    expandable: !!row.children?.length,
    initiallyExpanded: row.id === 'politiek',
    values: {
      articles: row.articles,
      pageviews: row.pageviews,
      www:
        valueDisplayMode === 'raw' ? row.www : distribution[0].percentageLabel,
      newsApp:
        valueDisplayMode === 'raw'
          ? row.newsApp
          : distribution[1].percentageLabel,
      digiPaperApp:
        valueDisplayMode === 'raw'
          ? row.digiPaperApp
          : distribution[2].percentageLabel,
    },
    distributionSegments: distribution,
    children: row.children?.map((child) =>
      mapTagsRowToReportRow(child, valueDisplayMode)
    ),
  };
}

export function flattenTagsRows(
  rows: TagsTableRowSource[]
): TagsTableRowSource[] {
  const flattened: TagsTableRowSource[] = [];

  for (const row of rows) {
    flattened.push(row);

    if (row.children?.length) {
      flattened.push(...flattenTagsRows(row.children));
    }
  }

  return flattened;
}

export function buildDistribution(
  www: number,
  newsApp: number,
  digiPaperApp: number
): ReportTableDistributionSegment[] {
  const total = www + newsApp + digiPaperApp;
  const wwwPct = total > 0 ? (www / total) * 100 : 0;
  const newsAppPct = total > 0 ? (newsApp / total) * 100 : 0;
  const digiPaperPct = total > 0 ? (digiPaperApp / total) * 100 : 0;

  return [
    {
      label: 'www',
      shortLabel: 'www',
      valueLabel: formatNumber(www),
      percentageLabel: formatPercent(wwwPct),
      percentage: wwwPct,
      colorClass: 'distribution-segment--www',
      tooltip: buildTooltip('www', www, wwwPct),
    },
    {
      label: 'news-app',
      shortLabel: 'news-app',
      valueLabel: formatNumber(newsApp),
      percentageLabel: formatPercent(newsAppPct),
      percentage: newsAppPct,
      colorClass: 'distribution-segment--news-app',
      tooltip: buildTooltip('news-app', newsApp, newsAppPct),
    },
    {
      label: 'digipaper-app',
      shortLabel: 'digipaper',
      valueLabel: formatNumber(digiPaperApp),
      percentageLabel: formatPercent(digiPaperPct),
      percentage: digiPaperPct,
      colorClass: 'distribution-segment--digi-paper',
      tooltip: buildTooltip('digipaper-app', digiPaperApp, digiPaperPct),
    },
  ];
}

function toSlug(value: string): string {
  return value.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-');
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('nl-BE').format(value);
}

function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

function buildTooltip(
  label: string,
  value: number,
  percentage: number
): string {
  return `${label} ${formatNumber(value)} (${formatPercent(percentage)})`;
}
