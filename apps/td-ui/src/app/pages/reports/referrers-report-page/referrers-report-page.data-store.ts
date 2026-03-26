import { Injectable, signal } from '@angular/core';
import { SimpleReportRowSource } from '../shared/simple-report-page-helpers';

@Injectable()
export class ReferrersReportPageDataStore {
  readonly rows = signal<SimpleReportRowSource[]>([
    {
      id: 'direct',
      name: 'Direct',
      articles: 521,
      pageviews: 304881,
      www: 142442,
      newsApp: 159214,
      digiPaperApp: 3225,
    },
    {
      id: 'search',
      name: 'Search',
      articles: 618,
      pageviews: 267440,
      www: 163981,
      newsApp: 100942,
      digiPaperApp: 2517,
    },
    {
      id: 'social',
      name: 'Social',
      articles: 233,
      pageviews: 118305,
      www: 74418,
      newsApp: 43110,
      digiPaperApp: 777,
    },
    {
      id: 'newsletter',
      name: 'Newsletter',
      articles: 144,
      pageviews: 84212,
      www: 30102,
      newsApp: 51733,
      digiPaperApp: 2377,
    },
    {
      id: 'push',
      name: 'Push notifications',
      articles: 81,
      pageviews: 66341,
      www: 11420,
      newsApp: 54122,
      digiPaperApp: 799,
    },
  ]);
}
