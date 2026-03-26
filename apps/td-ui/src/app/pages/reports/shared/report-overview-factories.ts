import { ReportOverviewGroup } from '@mh-traffic/mh-design';

export function createTagReportOverviewLeftGroups(): ReportOverviewGroup[] {
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

export function createTagReportOverviewRightGroups(): ReportOverviewGroup[] {
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
