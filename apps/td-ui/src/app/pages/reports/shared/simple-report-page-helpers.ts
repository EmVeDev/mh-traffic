import type {
  ReportOverviewGroup,
  ReportTableRow,
} from '@mh-traffic/mh-design';
import { buildDistribution } from './report-table-mappers';

export interface SimpleReportRowSource {
  id: string;
  name: string;
  articles: number;
  pageviews: number;
  www: number;
  newsApp: number;
  digiPaperApp: number;
  children?: SimpleReportRowSource[];
}

export function mapSimpleRowToReportRow(
  row: SimpleReportRowSource,
  valueDisplayMode: 'raw' | 'percentage',
  linkBase: string
): ReportTableRow {
  const distribution = buildDistribution(
    row.www,
    row.newsApp,
    row.digiPaperApp
  );

  return {
    id: row.id,
    name: row.name,
    link: `${linkBase}/${toSlug(row.name)}`,
    expandable: !!row.children?.length,
    initiallyExpanded: row.id === 'politics' || row.id === 'sports',
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
      mapSimpleRowToReportRow(child, valueDisplayMode, linkBase)
    ),
  };
}

export function flattenSimpleRows(
  rows: SimpleReportRowSource[]
): SimpleReportRowSource[] {
  const flattened: SimpleReportRowSource[] = [];

  for (const row of rows) {
    flattened.push(row);

    if (row.children?.length) {
      flattened.push(...flattenSimpleRows(row.children));
    }
  }

  return flattened;
}

export function createSimpleTotals(
  rows: SimpleReportRowSource[],
  valueDisplayMode: 'raw' | 'percentage'
): {
  name: string;
  values: Record<string, string | number>;
  distributionSegments: ReturnType<typeof buildDistribution>;
} {
  const flattened = flattenSimpleRows(rows);

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
      www: valueDisplayMode === 'raw' ? www : distribution[0].percentageLabel,
      newsApp:
        valueDisplayMode === 'raw' ? newsApp : distribution[1].percentageLabel,
      digiPaperApp:
        valueDisplayMode === 'raw'
          ? digiPaperApp
          : distribution[2].percentageLabel,
    },
    distributionSegments: distribution,
  };
}

export function createGenericOverviewLeftGroups(): ReportOverviewGroup[] {
  return [
    {
      title: 'Reach',
      icon: 'fa-rocket',
      sections: [
        {
          metrics: [
            {
              label: 'TOTAL READS',
              value: 2357411,
              valueType: 'number',
              delta: '+2,86%',
              deltaTone: 'positive',
            },
            {
              label: 'TOTAL PAGEVIEWS',
              value: 3371182,
              valueType: 'number',
              delta: '-1,86%',
              deltaTone: 'negative',
            },
          ],
        },
      ],
    },
    {
      title: 'Conversions',
      icon: 'fa-cart-shopping',
      sections: [
        {
          metrics: [
            {
              label: 'TOTAL PURCHASES',
              value: 23,
              valueType: 'number',
            },
            {
              label: 'TOTAL REGISTRATIONS',
              value: 128,
              valueType: 'number',
            },
          ],
        },
      ],
    },
  ];
}

export function createGenericOverviewRightGroups(): ReportOverviewGroup[] {
  return [
    {
      title: 'Engagement',
      icon: 'fa-users',
      sections: [
        {
          metrics: [
            {
              label: 'SUBSCRIBER ATT. TIME',
              value: 1662239,
              valueType: 'number',
              valueSuffix: ' min',
              delta: '+2,86%',
              deltaTone: 'positive',
            },
            {
              label: 'ATTENTION TIME',
              value: 2784462,
              valueType: 'number',
              valueSuffix: ' min',
              delta: '+2,86%',
              deltaTone: 'positive',
            },
          ],
        },
        {
          qualityItems: [
            {
              label: 'Bouncers',
              value: '15%',
              fillPercent: 15,
              tone: 'red',
            },
            {
              label: 'Scanners',
              value: '60%',
              fillPercent: 60,
              tone: 'yellow',
            },
            {
              label: 'Deeply reads',
              value: '25%',
              fillPercent: 25,
              tone: 'green',
            },
          ],
        },
      ],
    },
  ];
}

function toSlug(value: string): string {
  return value.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-');
}
