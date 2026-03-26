import { Injectable, signal } from '@angular/core';
import { SimpleReportRowSource } from '../shared/simple-report-page-helpers';

@Injectable()
export class AudiencesReportPageDataStore {
  readonly rows = signal<SimpleReportRowSource[]>([
    {
      id: 'anonymous',
      name: 'Anonymous',
      articles: 1211,
      pageviews: 438820,
      www: 224301,
      newsApp: 209882,
      digiPaperApp: 4637,
    },
    {
      id: 'registered',
      name: 'Registered',
      articles: 733,
      pageviews: 246905,
      www: 110284,
      newsApp: 133492,
      digiPaperApp: 3129,
    },
    {
      id: 'subscriber',
      name: 'Subscriber',
      articles: 602,
      pageviews: 318447,
      www: 122640,
      newsApp: 190842,
      digiPaperApp: 4965,
    },
  ]);
}
