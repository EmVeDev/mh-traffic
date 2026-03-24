import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { ArticleReferrerRepresentationComponent } from '../article-referrer-representation/article-referrer-representation.component';

type Metric = 'pageviews' | 'reads' | 'attention';

interface ReferrerMetricPoint {
  label: string;
  pageviews: number;
  reads: number;
  attention: number;
}

interface ReferrerSeries {
  id: string;
  name: string;
  color: string;
  points: ReferrerMetricPoint[];
}

interface LegendItem {
  id: string;
  name: string;
  color: string;
}

interface StackedPoint {
  x: number;
  y0: number;
  y1: number;
  value: number;
  label: string;
}

interface PreparedSeries {
  id: string;
  name: string;
  color: string;
  areaPath: string;
  linePath: string;
}

@Component({
  selector: 'td-article-referrer-section',
  standalone: true,
  imports: [ArticleReferrerRepresentationComponent],
  templateUrl: './article-referrer-section.component.html',
  styleUrl: './article-referrer-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleReferrerSectionComponent {
  readonly metric = signal<Metric>('pageviews');

  readonly metrics: { key: Metric; label: string }[] = [
    { key: 'pageviews', label: 'Pageviews' },
    { key: 'reads', label: 'Reads' },
    { key: 'attention', label: 'Attention time' },
  ];

  readonly chartWidth = 1120;
  readonly chartHeight = 360;
  readonly paddingTop = 18;
  readonly paddingRight = 18;
  readonly paddingBottom = 72;
  readonly paddingLeft = 58;

  readonly series = signal<ReferrerSeries[]>([
    {
      id: 'facebook',
      name: 'Facebook',
      color: '#516DB7',
      points: [
        { label: '18. Feb', pageviews: 40, reads: 10, attention: 18 },
        { label: '04:00', pageviews: 60, reads: 16, attention: 24 },
        { label: '08:00', pageviews: 80, reads: 18, attention: 25 },
        { label: '12:00', pageviews: 2600, reads: 700, attention: 1120 },
        { label: '13:00', pageviews: 1800, reads: 500, attention: 820 },
        { label: '14:00', pageviews: 1200, reads: 360, attention: 620 },
        { label: '16:00', pageviews: 1100, reads: 330, attention: 560 },
        { label: '18:00', pageviews: 800, reads: 240, attention: 420 },
        { label: '19. Feb', pageviews: 120, reads: 34, attention: 68 },
        { label: '04:00', pageviews: 40, reads: 12, attention: 20 },
        { label: '08:00', pageviews: 420, reads: 115, attention: 190 },
        { label: '20:00', pageviews: 18, reads: 6, attention: 8 },
        { label: '20. Feb', pageviews: 8, reads: 2, attention: 4 },
      ],
    },
    {
      id: 'internal-article',
      name: 'Internal – article',
      color: '#169E65',
      points: [
        { label: '18. Feb', pageviews: 20, reads: 5, attention: 12 },
        { label: '04:00', pageviews: 24, reads: 6, attention: 14 },
        { label: '08:00', pageviews: 26, reads: 8, attention: 15 },
        { label: '12:00', pageviews: 520, reads: 160, attention: 260 },
        { label: '13:00', pageviews: 360, reads: 120, attention: 220 },
        { label: '14:00', pageviews: 300, reads: 108, attention: 200 },
        { label: '16:00', pageviews: 420, reads: 136, attention: 240 },
        { label: '18:00', pageviews: 300, reads: 96, attention: 176 },
        { label: '19. Feb', pageviews: 40, reads: 12, attention: 28 },
        { label: '04:00', pageviews: 12, reads: 4, attention: 8 },
        { label: '08:00', pageviews: 160, reads: 54, attention: 88 },
        { label: '20:00', pageviews: 5, reads: 2, attention: 4 },
        { label: '20. Feb', pageviews: 3, reads: 1, attention: 2 },
      ],
    },
    {
      id: 'internal-home',
      name: 'Internal – home',
      color: '#58E2B9',
      points: [
        { label: '18. Feb', pageviews: 10, reads: 2, attention: 6 },
        { label: '04:00', pageviews: 14, reads: 4, attention: 8 },
        { label: '08:00', pageviews: 18, reads: 5, attention: 8 },
        { label: '12:00', pageviews: 420, reads: 130, attention: 210 },
        { label: '13:00', pageviews: 320, reads: 100, attention: 180 },
        { label: '14:00', pageviews: 260, reads: 86, attention: 150 },
        { label: '16:00', pageviews: 390, reads: 120, attention: 200 },
        { label: '18:00', pageviews: 220, reads: 72, attention: 120 },
        { label: '19. Feb', pageviews: 32, reads: 10, attention: 20 },
        { label: '04:00', pageviews: 8, reads: 2, attention: 5 },
        { label: '08:00', pageviews: 110, reads: 34, attention: 58 },
        { label: '20:00', pageviews: 4, reads: 1, attention: 3 },
        { label: '20. Feb', pageviews: 2, reads: 1, attention: 1 },
      ],
    },
    {
      id: 'newsletters',
      name: 'Newsletters',
      color: '#F05A4A',
      points: [
        { label: '18. Feb', pageviews: 0, reads: 0, attention: 0 },
        { label: '04:00', pageviews: 0, reads: 0, attention: 0 },
        { label: '08:00', pageviews: 0, reads: 0, attention: 0 },
        { label: '12:00', pageviews: 260, reads: 88, attention: 140 },
        { label: '13:00', pageviews: 190, reads: 64, attention: 100 },
        { label: '14:00', pageviews: 170, reads: 58, attention: 92 },
        { label: '16:00', pageviews: 280, reads: 96, attention: 150 },
        { label: '18:00', pageviews: 180, reads: 62, attention: 96 },
        { label: '19. Feb', pageviews: 24, reads: 8, attention: 16 },
        { label: '04:00', pageviews: 8, reads: 2, attention: 5 },
        { label: '08:00', pageviews: 70, reads: 24, attention: 38 },
        { label: '20:00', pageviews: 4, reads: 1, attention: 2 },
        { label: '20. Feb', pageviews: 2, reads: 1, attention: 1 },
      ],
    },
    {
      id: 'google-discover',
      name: 'Google Discover',
      color: '#F7B500',
      points: [
        { label: '18. Feb', pageviews: 0, reads: 0, attention: 0 },
        { label: '04:00', pageviews: 0, reads: 0, attention: 0 },
        { label: '08:00', pageviews: 0, reads: 0, attention: 0 },
        { label: '12:00', pageviews: 120, reads: 42, attention: 68 },
        { label: '13:00', pageviews: 98, reads: 36, attention: 60 },
        { label: '14:00', pageviews: 84, reads: 30, attention: 50 },
        { label: '16:00', pageviews: 96, reads: 32, attention: 56 },
        { label: '18:00', pageviews: 72, reads: 24, attention: 42 },
        { label: '19. Feb', pageviews: 10, reads: 4, attention: 8 },
        { label: '04:00', pageviews: 2, reads: 1, attention: 1 },
        { label: '08:00', pageviews: 38, reads: 12, attention: 20 },
        { label: '20:00', pageviews: 2, reads: 1, attention: 1 },
        { label: '20. Feb', pageviews: 1, reads: 0, attention: 1 },
      ],
    },
    {
      id: 'google',
      name: 'Google',
      color: '#E2A617',
      points: [
        { label: '18. Feb', pageviews: 0, reads: 0, attention: 0 },
        { label: '04:00', pageviews: 0, reads: 0, attention: 0 },
        { label: '08:00', pageviews: 0, reads: 0, attention: 0 },
        { label: '12:00', pageviews: 90, reads: 30, attention: 48 },
        { label: '13:00', pageviews: 74, reads: 24, attention: 40 },
        { label: '14:00', pageviews: 68, reads: 22, attention: 36 },
        { label: '16:00', pageviews: 76, reads: 26, attention: 42 },
        { label: '18:00', pageviews: 60, reads: 20, attention: 32 },
        { label: '19. Feb', pageviews: 8, reads: 2, attention: 5 },
        { label: '04:00', pageviews: 2, reads: 1, attention: 1 },
        { label: '08:00', pageviews: 28, reads: 10, attention: 16 },
        { label: '20:00', pageviews: 2, reads: 1, attention: 1 },
        { label: '20. Feb', pageviews: 1, reads: 0, attention: 1 },
      ],
    },
  ]);

  readonly legendItems = computed<LegendItem[]>(() =>
    this.series().map((item) => ({
      id: item.id,
      name: item.name,
      color: item.color,
    }))
  );

  readonly labels = computed(() => {
    const firstSeries = this.series()[0];
    return firstSeries ? firstSeries.points.map((point) => point.label) : [];
  });

  readonly maxTotalValue = computed(() => {
    const series = this.series();
    const labels = this.labels();
    let max = 0;

    for (let pointIndex = 0; pointIndex < labels.length; pointIndex += 1) {
      let total = 0;

      for (let seriesIndex = 0; seriesIndex < series.length; seriesIndex += 1) {
        total += this.getPointValue(
          series[seriesIndex].points[pointIndex],
          this.metric()
        );
      }

      if (total > max) {
        max = total;
      }
    }

    return max || 1;
  });

  readonly yTicks = computed(() => {
    const max = this.maxTotalValue();
    const roundedMax = this.roundUpMax(max);
    const step = roundedMax / 5;

    return Array.from({ length: 6 }, (_, index) => {
      const value = step * (5 - index);
      const ratio = value / roundedMax;
      const y = this.paddingTop + this.plotHeight - ratio * this.plotHeight;

      return {
        value,
        label: this.formatTick(value),
        y,
      };
    });
  });

  readonly preparedSeries = computed<PreparedSeries[]>(() => {
    const series = this.series();
    const metric = this.metric();
    const roundedMax = this.roundUpMax(this.maxTotalValue());
    const totalPoints = Math.max(this.labels().length - 1, 1);
    const stepX = this.plotWidth / totalPoints;

    const stackedBySeries: StackedPoint[][] = [];
    const runningTotals = new Array(this.labels().length).fill(0);

    for (let seriesIndex = 0; seriesIndex < series.length; seriesIndex += 1) {
      const currentSeries = series[seriesIndex];
      const stackedPoints: StackedPoint[] = [];

      for (
        let pointIndex = 0;
        pointIndex < currentSeries.points.length;
        pointIndex += 1
      ) {
        const point = currentSeries.points[pointIndex];
        const value = this.getPointValue(point, metric);
        const y0Value = runningTotals[pointIndex];
        const y1Value = y0Value + value;

        runningTotals[pointIndex] = y1Value;

        const x = this.paddingLeft + stepX * pointIndex;

        stackedPoints.push({
          x,
          y0: this.valueToY(y0Value, roundedMax),
          y1: this.valueToY(y1Value, roundedMax),
          value,
          label: point.label,
        });
      }

      stackedBySeries.push(stackedPoints);
    }

    return series.map((seriesItem, seriesIndex) => {
      const points = stackedBySeries[seriesIndex];

      return {
        id: seriesItem.id,
        name: seriesItem.name,
        color: seriesItem.color,
        areaPath: this.buildAreaPath(points),
        linePath: this.buildTopLinePath(points),
      };
    });
  });

  get plotWidth(): number {
    return this.chartWidth - this.paddingLeft - this.paddingRight;
  }

  get plotHeight(): number {
    return this.chartHeight - this.paddingTop - this.paddingBottom;
  }

  setMetric(metric: Metric): void {
    this.metric.set(metric);
  }

  trackMetric(_index: number, item: { key: Metric; label: string }): Metric {
    return item.key;
  }

  trackLegend(_index: number, item: LegendItem): string {
    return item.id;
  }

  trackTick(_index: number, item: { y: number }): number {
    return item.y;
  }

  trackPreparedSeries(_index: number, item: PreparedSeries): string {
    return item.id;
  }

  trackLabel(_index: number, item: string): string {
    return item;
  }

  private getPointValue(point: ReferrerMetricPoint, metric: Metric): number {
    switch (metric) {
      case 'reads':
        return point.reads;
      case 'attention':
        return point.attention;
      case 'pageviews':
      default:
        return point.pageviews;
    }
  }

  private roundUpMax(value: number): number {
    if (value <= 100) {
      return 100;
    }

    if (value <= 1000) {
      return Math.ceil(value / 100) * 100;
    }

    return Math.ceil(value / 1000) * 1000;
  }

  private formatTick(value: number): string {
    if (value >= 1000) {
      const short = value / 1000;
      return Number.isInteger(short) ? `${short}k` : `${short.toFixed(1)}k`;
    }

    return `${value}`;
  }

  private valueToY(value: number, max: number): number {
    const ratio = value / max;
    return this.paddingTop + this.plotHeight - ratio * this.plotHeight;
  }

  private buildTopLinePath(points: StackedPoint[]): string {
    if (!points.length) {
      return '';
    }

    let path = '';

    for (let index = 0; index < points.length; index += 1) {
      const point = points[index];
      path += `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y1} `;
    }

    return path.trim();
  }

  private buildAreaPath(points: StackedPoint[]): string {
    if (!points.length) {
      return '';
    }

    let topPath = '';
    let bottomPath = '';

    for (let index = 0; index < points.length; index += 1) {
      const point = points[index];
      topPath += `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y1} `;
    }

    for (let index = points.length - 1; index >= 0; index -= 1) {
      const point = points[index];
      bottomPath += `L ${point.x} ${point.y0} `;
    }

    return `${topPath}${bottomPath}Z`.trim();
  }

  protected readonly Math = Math;
}
