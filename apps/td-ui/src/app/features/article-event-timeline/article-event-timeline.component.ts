import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { MhdIconComponent } from '@mh-traffic/mh-design';

type ArticleEventTone = 'orange' | 'green' | 'red';
type ArticleEventCategory = 'content' | 'position';

interface RawTimelinePoint {
  timestamp: string;
  value: number;
}

interface RawArticleEventItem {
  id: string;
  label: string;
  timestamp: string;
  position: number;
  tone: ArticleEventTone;
  category: ArticleEventCategory;
  icon: string;
  iconSet?: string;
}

interface PositionedTimelinePoint extends RawTimelinePoint {
  x: number;
  y: number;
  xPx: number;
  yPx: number;
}

interface PositionedArticleEventItem extends RawArticleEventItem {
  x: number;
  xPx: number;
  yPx: number;
  displayTime: string;
}

@Component({
  selector: 'td-article-event-timeline',
  standalone: true,
  imports: [MhdIconComponent],
  templateUrl: './article-event-timeline.component.html',
  styleUrl: './article-event-timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleEventTimelineComponent {
  readonly chartWidth = 1200;
  readonly chartHeight = 420;
  readonly axisHeight = 26;
  readonly yAxisWidth = 46;
  readonly plotTop = 18;

  readonly markerIconSize = 34;
  readonly markerValueHeight = 28;
  readonly markerGap = 4;
  readonly stemGap = 4;
  readonly baseDotRadius = 4;

  readonly markerStackHeight =
    this.markerIconSize + this.markerGap + this.markerValueHeight;

  readonly plotBottomY = this.chartHeight - this.axisHeight;
  readonly plotTopY = this.plotTop;

  readonly plotInsetX = 40;

  readonly plotInnerWidth = this.chartWidth - this.yAxisWidth;
  readonly plotHeight = this.plotBottomY - this.plotTopY;
  readonly plotWidth = this.plotInnerWidth - this.plotInsetX * 2;

  readonly positionMarkerTopY = 54;
  readonly positionMarkerBottomY =
    this.plotBottomY - this.markerStackHeight - 10;

  readonly showContentUpdates = signal(true);
  readonly showPositionUpdates = signal(true);
  readonly hoveredId = signal<string | null>(null);
  readonly hoveredPointIndex = signal<number | null>(null);

  readonly selectedDate = signal('2026-02-18');

  readonly rawSeries = signal<RawTimelinePoint[]>([
    { timestamp: '2026-02-17T23:00:00', value: 7 },

    { timestamp: '2026-02-18T00:00:00', value: 18 },
    { timestamp: '2026-02-18T01:00:00', value: 19 },
    { timestamp: '2026-02-18T02:00:00', value: 62 },
    { timestamp: '2026-02-18T03:00:00', value: 82 },
    { timestamp: '2026-02-18T04:00:00', value: 68 },
    { timestamp: '2026-02-18T05:00:00', value: 77 },
    { timestamp: '2026-02-18T07:00:00', value: 36 },
    { timestamp: '2026-02-18T09:00:00', value: 46 },
    { timestamp: '2026-02-18T11:00:00', value: 55 },
    { timestamp: '2026-02-18T13:00:00', value: 64 },
    { timestamp: '2026-02-18T15:00:00', value: 58 },
    { timestamp: '2026-02-18T17:00:00', value: 61 },
    { timestamp: '2026-02-18T19:00:00', value: 54 },
    { timestamp: '2026-02-18T21:00:00', value: 44 },
    { timestamp: '2026-02-18T22:00:00', value: 30 },
    { timestamp: '2026-02-18T23:00:00', value: 10 },

    { timestamp: '2026-02-19T00:00:00', value: 4 },
    { timestamp: '2026-02-19T02:00:00', value: 12 },
    { timestamp: '2026-02-19T04:00:00', value: 18 },
    { timestamp: '2026-02-19T07:00:00', value: 28 },
    { timestamp: '2026-02-19T09:00:00', value: 22 },
    { timestamp: '2026-02-19T12:00:00', value: 17 },
    { timestamp: '2026-02-19T15:00:00', value: 13 },
    { timestamp: '2026-02-19T18:00:00', value: 8 },
    { timestamp: '2026-02-19T22:00:00', value: 3 },
  ]);

  readonly rawEvents = signal<RawArticleEventItem[]>([
    {
      id: 'published',
      label: 'Article published',
      timestamp: '2026-02-17T23:00:00',
      position: 7,
      tone: 'orange',
      category: 'content',
      icon: 'fa-globe',
    },
    {
      id: 'headline-update',
      label: 'Headline update',
      timestamp: '2026-02-18T03:00:00',
      position: 17,
      tone: 'orange',
      category: 'content',
      icon: 'fa-heading',
    },
    {
      id: 'position-up-1',
      label: 'Position up',
      timestamp: '2026-02-18T06:00:00',
      position: 4,
      tone: 'green',
      category: 'position',
      icon: 'fa-angles-up',
    },
    {
      id: 'position-down',
      label: 'Position down',
      timestamp: '2026-02-18T08:00:00',
      position: 10,
      tone: 'red',
      category: 'position',
      icon: 'fa-angles-down',
    },
    {
      id: 'position-up-2',
      label: 'Position up',
      timestamp: '2026-02-18T09:00:00',
      position: 7,
      tone: 'green',
      category: 'position',
      icon: 'fa-angles-up',
    },
    {
      id: 'image-update',
      label: 'Image update',
      timestamp: '2026-02-18T12:00:00',
      position: 7,
      tone: 'orange',
      category: 'content',
      icon: 'fa-image',
    },
    {
      id: 'headline-image-update',
      label: 'Headline & image update',
      timestamp: '2026-02-18T13:00:00',
      position: 7,
      tone: 'orange',
      category: 'content',
      icon: 'fa-images',
    },
    {
      id: 'position-down-2',
      label: 'Position down',
      timestamp: '2026-02-18T16:00:00',
      position: 20,
      tone: 'red',
      category: 'position',
      icon: 'fa-angles-down',
    },
    {
      id: 'position-up-3',
      label: 'Position up',
      timestamp: '2026-02-18T23:00:00',
      position: 10,
      tone: 'green',
      category: 'position',
      icon: 'fa-angles-up',
    },
    {
      id: 'day2-position-up',
      label: 'Position up',
      timestamp: '2026-02-19T09:15:00',
      position: 5,
      tone: 'green',
      category: 'position',
      icon: 'fa-angles-up',
    },
  ]);

  readonly selectedDayStart = computed(() =>
    this.parseDateOnly(this.selectedDate())
  );

  readonly selectedDayEnd = computed(() => {
    const start = this.selectedDayStart();
    return new Date(start.getTime() + 24 * 60 * 60 * 1000);
  });

  readonly normalizedDaySeries = computed<RawTimelinePoint[]>(() => {
    const start = this.selectedDayStart();
    const end = this.selectedDayEnd();
    const lookup = new Map<number, number>();

    for (const point of this.rawSeries()) {
      const date = new Date(point.timestamp);
      if (date >= start && date < end) {
        lookup.set(date.getHours(), point.value);
      }
    }

    return Array.from({ length: 24 }, (_, hour) => ({
      timestamp: this.toHourTimestamp(start, hour).toISOString(),
      value: lookup.get(hour) ?? 0,
    }));
  });

  readonly domain = computed(() => {
    const start = this.selectedDayStart().getTime();
    const end = this.selectedDayEnd().getTime();
    const values = this.normalizedDaySeries().map((point) => point.value);

    const maxValue = Math.max(...values, 1);
    const yMax = Math.ceil(maxValue * 1.15);

    return {
      minX: start,
      maxX: end,
      yMin: 0,
      yMax,
    };
  });

  readonly yAxisTicks = computed(() => {
    const { yMax } = this.domain();
    const steps = 4;

    return Array.from({ length: steps + 1 }, (_, index) => {
      const ratio = index / steps;
      const value = Math.round(yMax - ratio * yMax);
      const y = this.plotTopY + ratio * this.plotHeight;

      return { value, y };
    });
  });

  readonly filteredRawEvents = computed<RawArticleEventItem[]>(() => {
    const start = this.selectedDayStart();
    const end = this.selectedDayEnd();

    return this.rawEvents().filter((event) => {
      const timestamp = new Date(event.timestamp);

      if (!(timestamp >= start && timestamp < end)) {
        return false;
      }

      if (event.category === 'content' && !this.showContentUpdates()) {
        return false;
      }

      if (event.category === 'position' && !this.showPositionUpdates()) {
        return false;
      }

      return true;
    });
  });

  readonly maxOverallPosition = computed(() => {
    return Math.max(...this.rawEvents().map((event) => event.position), 1);
  });

  readonly positionedSeries = computed<PositionedTimelinePoint[]>(() =>
    this.normalizedDaySeries().map((point) => {
      const x = this.timestampToPercent(point.timestamp);
      const y = this.valueToPercent(point.value);

      return {
        ...point,
        x,
        y,
        xPx: this.scaleXPercent(x),
        yPx: this.scaleYPercent(y),
      };
    })
  );

  readonly filteredEvents = computed<PositionedArticleEventItem[]>(() => {
    const maxPosition = this.maxOverallPosition();

    return this.filteredRawEvents().map((event) => {
      const x = this.timestampToPercent(event.timestamp);

      return {
        ...event,
        x,
        xPx: this.scaleXPercent(x),
        yPx: this.positionToY(event.position, maxPosition),
        displayTime: this.formatTime(event.timestamp),
      };
    });
  });

  readonly linePath = computed(() =>
    this.buildLinePath(this.positionedSeries())
  );

  readonly areaPath = computed(() =>
    this.buildAreaPath(this.positionedSeries())
  );

  readonly xAxisLabels = computed(() => {
    const start = this.selectedDayStart();

    return [
      this.formatDayLabel(start),
      '01:30',
      '03:00',
      '04:30',
      '06:00',
      '07:30',
      '09:00',
      '10:30',
      '12:00',
      '13:30',
      '15:00',
      '16:30',
      '18:00',
      '19:30',
      '21:00',
      '22:30',
      this.formatDayLabel(new Date(start.getTime() + 24 * 60 * 60 * 1000)),
    ];
  });

  readonly xAxisItems = computed(() => {
    const labels = this.xAxisLabels();

    return labels.map((label, index) => ({
      label,
      isPreviousNav: index === 0,
      isNextNav: index === labels.length - 1,
    }));
  });

  readonly selectedDateLabel = computed(() =>
    new Intl.DateTimeFormat('nl-BE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(this.selectedDayStart())
  );

  previousDay(): void {
    const current = this.selectedDayStart();
    const previous = new Date(current.getTime() - 24 * 60 * 60 * 1000);
    this.selectedDate.set(this.toDateOnly(previous));
    this.clearHoverState();
  }

  nextDay(): void {
    const current = this.selectedDayStart();
    const next = new Date(current.getTime() + 24 * 60 * 60 * 1000);
    this.selectedDate.set(this.toDateOnly(next));
    this.clearHoverState();
  }

  toggleContentUpdates(): void {
    this.showContentUpdates.update((value) => !value);
    this.clearHoverState();
  }

  togglePositionUpdates(): void {
    this.showPositionUpdates.update((value) => !value);
    this.clearHoverState();
  }

  setHovered(id: string | null): void {
    this.hoveredId.set(id);
  }

  setHoveredPoint(index: number | null): void {
    this.hoveredPointIndex.set(index);
  }

  toneClass(tone: ArticleEventTone): string {
    return `event-marker--${tone}`;
  }

  categoryChipClass(isActive: boolean): string {
    return isActive
      ? 'legend-chip legend-chip--active'
      : 'legend-chip legend-chip--inactive';
  }

  eventLeftPercent(event: PositionedArticleEventItem): number {
    return (event.xPx / this.plotInnerWidth) * 100;
  }

  eventTopPercent(event: PositionedArticleEventItem): number {
    return (event.yPx / this.plotBottomY) * 100;
  }

  stemStartY(event: PositionedArticleEventItem): number {
    return event.yPx + this.markerStackHeight + this.stemGap;
  }

  stemEndY(): number {
    return this.plotBottomY;
  }

  pointTooltip(point: PositionedTimelinePoint): string {
    return `${this.formatDateTime(point.timestamp)} · ${this.formatNumber(
      point.value
    )} pageviews`;
  }

  private timestampToPercent(timestamp: string): number {
    const { minX, maxX } = this.domain();
    const value = new Date(timestamp).getTime();

    if (maxX === minX) return 0;
    return ((value - minX) / (maxX - minX)) * 100;
  }

  private valueToPercent(value: number): number {
    const { yMin, yMax } = this.domain();

    if (yMax === yMin) return 100;
    return ((yMax - value) / (yMax - yMin)) * 100;
  }

  private scaleXPercent(percent: number): number {
    return this.plotInsetX + (percent / 100) * this.plotWidth;
  }

  private scaleYPercent(percent: number): number {
    return this.plotTopY + (percent / 100) * this.plotHeight;
  }

  private positionToY(position: number, maxPosition: number): number {
    if (maxPosition <= 1) {
      return this.positionMarkerTopY;
    }

    const ratio = (position - 1) / (maxPosition - 1);

    return (
      this.positionMarkerTopY +
      ratio * (this.positionMarkerBottomY - this.positionMarkerTopY)
    );
  }

  private buildLinePath(points: PositionedTimelinePoint[]): string {
    if (!points.length) return '';

    return points
      .map((point, index) => {
        const x = this.yAxisWidth + point.xPx;
        const y = point.yPx;
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  }

  private buildAreaPath(points: PositionedTimelinePoint[]): string {
    if (!points.length) return '';

    const line = this.buildLinePath(points);
    const lastX = this.yAxisWidth + points[points.length - 1].xPx;
    const firstX = this.yAxisWidth + points[0].xPx;

    return `${line} L ${lastX} ${this.plotBottomY} L ${firstX} ${this.plotBottomY} Z`;
  }

  private formatDateTime(timestamp: string): string {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('nl-BE', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  private formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('nl-BE', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  private formatNumber(value: number): string {
    return new Intl.NumberFormat('nl-BE').format(value);
  }

  private formatDayLabel(date: Date): string {
    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'short' });
    return `${day}. ${month}`;
  }

  private parseDateOnly(value: string): Date {
    return new Date(`${value}T00:00:00`);
  }

  private toDateOnly(date: Date): string {
    const y = date.getFullYear();
    const m = `${date.getMonth() + 1}`.padStart(2, '0');
    const d = `${date.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private toHourTimestamp(baseDate: Date, hour: number): Date {
    return new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      hour,
      0,
      0,
      0
    );
  }

  private clearHoverState(): void {
    this.hoveredId.set(null);
    this.hoveredPointIndex.set(null);
  }
}
