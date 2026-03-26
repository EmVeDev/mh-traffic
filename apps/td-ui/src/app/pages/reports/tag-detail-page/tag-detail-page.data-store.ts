import { Injectable, signal } from '@angular/core';
import { SimpleReportRowSource } from '../shared/simple-report-page-helpers';

@Injectable()
export class TagDetailPageDataStore {
  readonly rows = signal<SimpleReportRowSource[]>([
    {
      id: 'article-1',
      name: 'Election night live blog',
      articles: 1,
      pageviews: 112440,
      www: 48122,
      newsApp: 62184,
      digiPaperApp: 2134,
    },
    {
      id: 'article-2',
      name: 'Five politicians who shaped the debate',
      articles: 1,
      pageviews: 84231,
      www: 34118,
      newsApp: 48902,
      digiPaperApp: 1211,
    },
    {
      id: 'article-3',
      name: 'What voters care about most right now',
      articles: 1,
      pageviews: 63112,
      www: 27541,
      newsApp: 34798,
      digiPaperApp: 773,
    },
    {
      id: 'article-4',
      name: 'Coalition options compared in one chart',
      articles: 1,
      pageviews: 44791,
      www: 19300,
      newsApp: 24861,
      digiPaperApp: 630,
    },
  ]);
}
