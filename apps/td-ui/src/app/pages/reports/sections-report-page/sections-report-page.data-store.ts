import { Injectable, signal } from '@angular/core';
import { SimpleReportRowSource } from '../shared/simple-report-page-helpers';

@Injectable()
export class SectionsReportPageDataStore {
  readonly rows = signal<SimpleReportRowSource[]>([
    {
      id: 'home-news',
      name: 'News',
      articles: 932,
      pageviews: 482311,
      www: 201552,
      newsApp: 274118,
      digiPaperApp: 6641,
      children: [
        {
          id: 'politics',
          name: 'Politics',
          articles: 241,
          pageviews: 126402,
          www: 50311,
          newsApp: 74480,
          digiPaperApp: 1611,
        },
        {
          id: 'justice',
          name: 'Justice',
          articles: 133,
          pageviews: 73218,
          www: 32119,
          newsApp: 40104,
          digiPaperApp: 995,
        },
      ],
    },
    {
      id: 'sport',
      name: 'Sport',
      articles: 701,
      pageviews: 391245,
      www: 164203,
      newsApp: 223998,
      digiPaperApp: 3044,
    },
    {
      id: 'showbiz',
      name: 'Showbiz',
      articles: 412,
      pageviews: 188504,
      www: 94118,
      newsApp: 92362,
      digiPaperApp: 2024,
    },
    {
      id: 'lifestyle',
      name: 'Lifestyle',
      articles: 356,
      pageviews: 142220,
      www: 81233,
      newsApp: 59684,
      digiPaperApp: 1303,
    },
    {
      id: 'opinion',
      name: 'Opinion',
      articles: 184,
      pageviews: 67443,
      www: 35101,
      newsApp: 31022,
      digiPaperApp: 1320,
    },
  ]);
}
