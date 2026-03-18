import { ChartSeries } from './common';

export interface AudienceResponseDTO {
  cookies?: ChartSeries[];
  timeOnSite?: ChartSeries[];
  doc_count?: ChartSeries[];
}
