export type ChartSeriesPoint = [timestamp: number, value: number];

export interface ChartSeries {
  data: ChartSeriesPoint[];
  name: string;
  color: string;
}
