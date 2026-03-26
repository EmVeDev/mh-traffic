import { Injectable, signal } from '@angular/core';

export interface TagsTableRowSource {
  id: string;
  name: string;
  articles: number;
  pageviews: number;
  www: number;
  newsApp: number;
  digiPaperApp: number;
  children?: TagsTableRowSource[];
}

@Injectable()
export class TagsReportPageDataStore {
  readonly rows = signal<TagsTableRowSource[]>([
    {
      id: 'politiek',
      name: 'politiek',
      articles: 676,
      pageviews: 218579,
      www: 97581,
      newsApp: 119587,
      digiPaperApp: 1411,
      children: [
        {
          id: 'politiek-federaal',
          name: 'federaal',
          articles: 221,
          pageviews: 85461,
          www: 38742,
          newsApp: 46107,
          digiPaperApp: 612,
        },
        {
          id: 'politiek-vlaams',
          name: 'vlaams',
          articles: 193,
          pageviews: 69104,
          www: 30281,
          newsApp: 38622,
          digiPaperApp: 201,
        },
      ],
    },
    {
      id: 'lokale-fd',
      name: 'lokale fd',
      articles: 884,
      pageviews: 211161,
      www: 115843,
      newsApp: 94687,
      digiPaperApp: 631,
    },
    {
      id: 'werkloosheid',
      name: 'werkloosheid',
      articles: 800,
      pageviews: 136581,
      www: 98967,
      newsApp: 37614,
      digiPaperApp: 0,
    },
    {
      id: 'weer',
      name: 'weer',
      articles: 1767,
      pageviews: 111822,
      www: 53442,
      newsApp: 58380,
      digiPaperApp: 0,
    },
    {
      id: 'play',
      name: 'play',
      articles: 1244,
      pageviews: 102705,
      www: 54501,
      newsApp: 48204,
      digiPaperApp: 0,
    },
  ]);
}
