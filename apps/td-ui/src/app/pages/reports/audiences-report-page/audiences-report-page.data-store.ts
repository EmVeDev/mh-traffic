import { Injectable, signal } from '@angular/core';
import { SimpleReportRowSource } from '../shared/simple-report-page-helpers';

@Injectable()
export class AudiencesReportPageDataStore {
  readonly rows = signal<SimpleReportRowSource[]>([
    {
      id: 'anonymous',
      name: 'Anonymous',
      articles: 1767,
      pageviews: 311822,
      www: 153442,
      newsApp: 158380,
      digiPaperApp: 0,
    },
    {
      id: 'registered',
      name: 'Registered',
      articles: 1244,
      pageviews: 202705,
      www: 84501,
      newsApp: 117204,
      digiPaperApp: 1000,
    },
    {
      id: 'subscriber',
      name: 'Subscriber',
      articles: 884,
      pageviews: 411161,
      www: 165843,
      newsApp: 244687,
      digiPaperApp: 631,
    },
  ]);
}
