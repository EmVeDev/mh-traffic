import { Injectable, signal } from '@angular/core';
import { SimpleReportRowSource } from '../shared/simple-report-page-helpers';

@Injectable()
export class TagDetailPageDataStore {
  readonly rows = signal<SimpleReportRowSource[]>([
    {
      id: 'article-1',
      name: 'Election night live blog',
      articles: 1,
      pageviews: 85461,
      www: 38742,
      newsApp: 46107,
      digiPaperApp: 612,
    },
    {
      id: 'article-2',
      name: 'Key takeaways from the debate',
      articles: 1,
      pageviews: 69104,
      www: 30281,
      newsApp: 38622,
      digiPaperApp: 201,
    },
    {
      id: 'article-3',
      name: 'What voters care about most',
      articles: 1,
      pageviews: 57881,
      www: 24118,
      newsApp: 33412,
      digiPaperApp: 351,
    },
    {
      id: 'article-4',
      name: 'Coalition options compared',
      articles: 1,
      pageviews: 42057,
      www: 21420,
      newsApp: 20537,
      digiPaperApp: 100,
    },
  ]);
}
