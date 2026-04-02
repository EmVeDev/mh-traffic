export type MhdChartType = 'line' | 'area' | 'bar';

export interface MhdChartPoint {
  x: number;
  y: number | null;
}

export interface MhdChartSeries {
  id: string;
  label: string;
  color: string;
  data: MhdChartPoint[];
  comparison?: boolean;
  initiallyVisible?: boolean;
}

export interface MhdChartConfig {
  type: MhdChartType;
  allowedTypes?: MhdChartType[];
  series: MhdChartSeries[];

  showLegend?: boolean;
  showGrid?: boolean;
  yAxisTicks?: number;
  emptyStateLabel?: string;

  xAxisFormatter?: (value: number) => string;
  yAxisFormatter?: (value: number) => string;
  tooltipTitleFormatter?: (value: number) => string;
  tooltipValueFormatter?: (value: number) => string;
  currentTimeLabelFormatter?: (value: number) => string;

  currentTimeX?: number | null;
}
