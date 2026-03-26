import { Injectable, signal } from '@angular/core';
import { SimpleReportRowSource } from '../shared/simple-report-page-helpers';

@Injectable()
export class ReferrersReportPageDataStore {
  readonly rows = signal<SimpleReportRowSource[]>([
    {
      id: 'direct',
      name: 'Direct',
      articles: 676,
      pageviews: 218579,
      www: 97581,
      newsApp: 119587,
      digiPaperApp: 1411,
    },
    {
      id: 'search',
      name: 'Search',
      articles: 884,
      pageviews: 211161,
      www: 115843,
      newsApp: 94687,
      digiPaperApp: 631,
    },
    {
      id: 'social',
      name: 'Social',
      articles: 800,
      pageviews: 136581,
      www: 98967,
      newsApp: 37614,
      digiPaperApp: 0,
    },
    {
      id: 'newsletter',
      name: 'Newsletter',
      articles: 1767,
      pageviews: 111822,
      www: 53442,
      newsApp: 58380,
      digiPaperApp: 0,
    },
    {
      id: 'push',
      name: 'Push notifications',
      articles: 1244,
      pageviews: 102705,
      www: 54501,
      newsApp: 48204,
      digiPaperApp: 0,
    },
  ]);
}
