import { Injectable, signal } from '@angular/core';
import { SimpleReportRowSource } from '../shared/simple-report-page-helpers';

@Injectable()
export class SectionDetailPageDataStore {
  readonly rows = signal<SimpleReportRowSource[]>([
    {
      id: 'article-1',
      name: 'Government reaches budget deal after midnight talks',
      articles: 1,
      pageviews: 94320,
      www: 38210,
      newsApp: 54820,
      digiPaperApp: 1290,
    },
    {
      id: 'article-2',
      name: 'Five takeaways from the coalition compromise',
      articles: 1,
      pageviews: 68114,
      www: 30111,
      newsApp: 36902,
      digiPaperApp: 1101,
    },
    {
      id: 'article-3',
      name: 'Why this reform package matters for households',
      articles: 1,
      pageviews: 52773,
      www: 22440,
      newsApp: 29654,
      digiPaperApp: 679,
    },
    {
      id: 'article-4',
      name: 'Opposition leaders react with heavy criticism',
      articles: 1,
      pageviews: 41422,
      www: 19344,
      newsApp: 21561,
      digiPaperApp: 517,
    },
  ]);
}
