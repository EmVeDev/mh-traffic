import { Injectable, signal } from '@angular/core';
import { SimpleReportRowSource } from '../shared/simple-report-page-helpers';

@Injectable()
export class SectionsReportPageDataStore {
  readonly rows = signal<SimpleReportRowSource[]>([
    {
      id: 'politics',
      name: 'Politics',
      articles: 676,
      pageviews: 218579,
      www: 97581,
      newsApp: 119587,
      digiPaperApp: 1411,
      children: [
        {
          id: 'federal',
          name: 'Federal',
          articles: 221,
          pageviews: 85461,
          www: 38742,
          newsApp: 46107,
          digiPaperApp: 612,
        },
        {
          id: 'regional',
          name: 'Regional',
          articles: 193,
          pageviews: 69104,
          www: 30281,
          newsApp: 38622,
          digiPaperApp: 201,
        },
      ],
    },
    {
      id: 'sport',
      name: 'Sport',
      articles: 884,
      pageviews: 211161,
      www: 115843,
      newsApp: 94687,
      digiPaperApp: 631,
    },
    {
      id: 'economy',
      name: 'Economy',
      articles: 800,
      pageviews: 136581,
      www: 98967,
      newsApp: 37614,
      digiPaperApp: 0,
    },
    {
      id: 'weather',
      name: 'Weather',
      articles: 1767,
      pageviews: 111822,
      www: 53442,
      newsApp: 58380,
      digiPaperApp: 0,
    },
    {
      id: 'culture',
      name: 'Culture',
      articles: 1244,
      pageviews: 102705,
      www: 54501,
      newsApp: 48204,
      digiPaperApp: 0,
    },
  ]);
}
