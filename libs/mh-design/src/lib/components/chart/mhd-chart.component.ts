import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  SecurityContext,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MhdIconComponent } from '../icon/mhd-icon.component';
import {
  MhdChartConfig,
  MhdChartPoint,
  MhdChartSeries,
  MhdChartType,
} from './mhd-chart.types';

interface ChartPoint {
  x: number;
  y: number;
  rawX: number;
  rawY: number;
  index: number;
}

interface ChartRect {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  rawX: number;
  rawY: number;
}

interface HoverSeriesItem {
  id: string;
  label: string;
  color: string;
  comparison?: boolean;
  rawX: number;
  rawY: number;
  canvasX: number;
  canvasY: number;
  valueLabel: string;
}

interface HoverSnapshot {
  rawX: number;
  title: string;
  markerX: number;
  tooltipLeft: number;
  items: HoverSeriesItem[];
}

interface CurrentTimeMarkerLabel {
  x: number;
  y: number;
  textAnchor: 'start' | 'end';
  label: string;
}

interface ExportLegendItem {
  id: string;
  label: string;
  color: string;
  comparison?: boolean;
  inactive: boolean;
}

interface ExportLegendPositionedItem extends ExportLegendItem {
  x: number;
  y: number;
  width: number;
}

interface ExportLegendLayout {
  items: ExportLegendPositionedItem[];
  totalHeight: number;
}

@Component({
  selector: 'mhd-chart',
  standalone: true,
  imports: [MhdIconComponent],
  templateUrl: './mhd-chart.component.html',
  styleUrl: './mhd-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MhdChartComponent {
  private readonly document = inject(DOCUMENT) as Document;
  private readonly sanitizer = inject(DomSanitizer);

  private readonly exportContentRef =
    viewChild<ElementRef<HTMLDivElement>>('exportContent');

  readonly title = input.required<string>();
  readonly config = input.required<MhdChartConfig>();

  protected readonly sanitizedTitle = computed(
    () => this.sanitizer.sanitize(SecurityContext.HTML, this.title()) ?? ''
  );

  readonly viewBoxWidth = 820;
  readonly viewBoxHeight = 320;

  readonly paddingTop = 18;
  readonly paddingRight = 18;
  readonly paddingBottom = 42;
  readonly paddingLeft = 58;

  readonly selectedType = signal<MhdChartType>('area');
  readonly hiddenSeriesIds = signal<Set<string>>(new Set());
  readonly hoveredXValue = signal<number | null>(null);

  readonly chartWidth = this.viewBoxWidth;
  readonly chartHeight = this.viewBoxHeight;
  readonly plotWidth = this.viewBoxWidth - this.paddingLeft - this.paddingRight;
  readonly plotHeight =
    this.viewBoxHeight - this.paddingTop - this.paddingBottom;
  readonly plotBottom = this.viewBoxHeight - this.paddingBottom;

  readonly resolvedAllowedTypes = computed((): MhdChartType[] => {
    const allowed = this.config().allowedTypes;
    if (allowed?.length) {
      return [...allowed];
    }

    return ['line', 'area', 'bar'];
  });

  readonly resolvedType = computed<MhdChartType>(() => {
    const selected = this.selectedType();
    const allowed = this.resolvedAllowedTypes();
    return allowed.includes(selected) ? selected : this.config().type;
  });

  readonly normalizedSeries = computed(() =>
    this.config().series.map((series) => ({
      ...series,
      data: this.normalizeSeriesData(series.data),
    }))
  );

  readonly visibleSeries = computed(() =>
    this.normalizedSeries().filter(
      (series) => !this.hiddenSeriesIds().has(series.id)
    )
  );

  readonly visiblePrimarySeries = computed(() =>
    this.visibleSeries().filter((series) => !series.comparison)
  );

  readonly visibleComparisonSeries = computed(() =>
    this.visibleSeries().filter((series) => !!series.comparison)
  );

  readonly allXValues = computed(() => {
    const values = this.normalizedSeries().flatMap((series) =>
      series.data.map((point) => point.x)
    );

    return [...new Set(values)].sort((a, b) => a - b);
  });

  readonly xMin = computed(() => {
    const values = this.allXValues();
    return values.length ? values[0] : 0;
  });

  readonly xMax = computed(() => {
    const values = this.allXValues();
    return values.length ? values[values.length - 1] : 1;
  });

  readonly hasVisibleData = computed(() =>
    this.visibleSeries().some((series) =>
      series.data.some((point) => typeof point.y === 'number')
    )
  );

  readonly yMax = computed(() => {
    const max = Math.max(
      0,
      ...this.visibleSeries().flatMap((series) =>
        series.data.map((point) => point.y ?? 0)
      )
    );

    return this.toNiceMax(max);
  });

  readonly yTicks = computed(() => {
    const tickCount = Math.max(2, this.config().yAxisTicks ?? 5);
    const max = this.yMax();
    const step = max / tickCount;

    return Array.from({ length: tickCount + 1 }, (_, index) => {
      const value = step * index;
      const y = this.plotBottom - (value / max) * this.plotHeight;

      return {
        value,
        label: this.formatYAxis(value),
        y,
      };
    });
  });

  readonly xTicks = computed(() => {
    const values = this.allXValues();
    if (!values.length) {
      return [];
    }

    const desiredCount = Math.min(6, values.length);
    if (desiredCount === 1) {
      return [values[0]];
    }

    return Array.from({ length: desiredCount }, (_, index) => {
      const ratio = index / (desiredCount - 1);
      const sourceIndex = Math.round(ratio * (values.length - 1));
      return values[sourceIndex];
    }).filter((value, index, arr) => index === 0 || value !== arr[index - 1]);
  });

  readonly currentTimeMarkerX = computed(() => {
    const currentTimeX = this.config().currentTimeX;
    if (currentTimeX == null) {
      return null;
    }

    return this.valueToCanvasX(currentTimeX);
  });

  readonly currentTimeMarkerLabel = computed<CurrentTimeMarkerLabel | null>(
    () => {
      const currentTimeX = this.config().currentTimeX;
      if (currentTimeX == null) {
        return null;
      }

      const markerX = this.valueToCanvasX(currentTimeX);
      const label = this.formatCurrentTimeLabel(currentTimeX);

      const averageCharacterWidth = 6.8;
      const horizontalPadding = 18;
      const estimatedLabelWidth =
        label.length * averageCharacterWidth + horizontalPadding * 2;
      const preferredOffset = 10;
      const minX = this.paddingLeft + 6;
      const maxX = this.chartWidth - this.paddingRight - 6;

      const preferredRightX = markerX + preferredOffset;
      const rightEdgeIfPlacedRight = preferredRightX + estimatedLabelWidth;

      if (rightEdgeIfPlacedRight <= maxX) {
        return {
          x: preferredRightX,
          y: this.paddingTop + 14,
          textAnchor: 'start',
          label,
        };
      }

      return {
        x: Math.max(minX, markerX - preferredOffset),
        y: this.paddingTop + 14,
        textAnchor: 'end',
        label,
      };
    }
  );

  readonly clippedPrimarySeries = computed(() => {
    const currentTimeX = this.config().currentTimeX;

    return this.visiblePrimarySeries().map((series) => ({
      ...series,
      data:
        currentTimeX == null
          ? series.data
          : series.data.filter((point) => point.x <= currentTimeX),
    }));
  });

  readonly interactiveSeries = computed(() => [
    ...this.visibleComparisonSeries(),
    ...this.clippedPrimarySeries(),
  ]);

  readonly hoverSnapshot = computed<HoverSnapshot | null>(() => {
    const hoveredX = this.hoveredXValue();
    if (hoveredX == null) {
      return null;
    }

    const items = this.interactiveSeries().flatMap((series) => {
      const point = series.data.find(
        (item) => item.x === hoveredX && typeof item.y === 'number'
      );

      if (!point || typeof point.y !== 'number') {
        return [];
      }

      return [
        {
          id: series.id,
          label: series.label,
          color: series.color,
          comparison: series.comparison,
          rawX: point.x,
          rawY: point.y,
          canvasX: this.valueToCanvasX(point.x),
          canvasY: this.valueToCanvasY(point.y),
          valueLabel: this.formatTooltipValue(point.y),
        } satisfies HoverSeriesItem,
      ];
    });

    if (!items.length) {
      return null;
    }

    const markerX = this.valueToCanvasX(hoveredX);

    return {
      rawX: hoveredX,
      title: this.formatTooltipTitle(hoveredX),
      markerX,
      tooltipLeft: this.clamp(markerX, 120, this.chartWidth - 120),
      items,
    };
  });

  protected setType(type: MhdChartType): void {
    this.selectedType.set(type);
    this.clearHover();
  }

  protected isSeriesVisible(seriesId: string): boolean {
    return !this.hiddenSeriesIds().has(seriesId);
  }

  protected toggleSeries(seriesId: string): void {
    const next = new Set(this.hiddenSeriesIds());

    if (next.has(seriesId)) {
      next.delete(seriesId);
    } else {
      next.add(seriesId);
    }

    this.hiddenSeriesIds.set(next);
    this.clearHover();
  }

  protected typeTitle(type: MhdChartType): string {
    switch (type) {
      case 'line':
        return 'Line';
      case 'area':
        return 'Area';
      case 'bar':
        return 'Bar';
      default:
        return type;
    }
  }

  protected formatXAxisLabel(value: number): string {
    return this.config().xAxisFormatter?.(value) ?? `${value}`;
  }

  protected linePath(series: MhdChartSeries): string {
    const points = this.seriesPoints(series);
    if (!points.length) {
      return '';
    }

    return points
      .map(
        (point, index) =>
          `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(
            2
          )}`
      )
      .join(' ');
  }

  protected areaPath(series: MhdChartSeries): string {
    const points = this.seriesPoints(series);
    if (!points.length) {
      return '';
    }

    const line = points
      .map(
        (point, index) =>
          `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(
            2
          )}`
      )
      .join(' ');

    const last = points[points.length - 1];
    const first = points[0];

    return `${line} L ${last.x.toFixed(2)} ${this.plotBottom.toFixed(
      2
    )} L ${first.x.toFixed(2)} ${this.plotBottom.toFixed(2)} Z`;
  }

  protected barRects(series: MhdChartSeries): ChartRect[] {
    const allX = this.allXValues();
    const primaryVisible = this.visiblePrimarySeries();
    const comparisonVisible = this.visibleComparisonSeries();
    const visibleForBars = [...primaryVisible, ...comparisonVisible];
    const seriesIndex = visibleForBars.findIndex(
      (item) => item.id === series.id
    );
    const visibleCount = Math.max(1, visibleForBars.length);

    if (!allX.length) {
      return [];
    }

    const groupWidth = this.plotWidth / allX.length;
    const outerPadding = 8;
    const innerGap = 6;
    const barWidth =
      (groupWidth - outerPadding * 2 - innerGap * (visibleCount - 1)) /
      visibleCount;

    return series.data.flatMap((point) => {
      if (typeof point.y !== 'number') {
        return [];
      }

      const pointIndex = allX.findIndex((value) => value === point.x);
      if (pointIndex === -1) {
        return [];
      }

      const x =
        this.paddingLeft +
        pointIndex * groupWidth +
        outerPadding +
        seriesIndex * (barWidth + innerGap);

      const y = this.valueToCanvasY(point.y);
      const height = Math.max(0, this.plotBottom - y);

      return [
        {
          x,
          y,
          width: Math.max(4, barWidth),
          height,
          radius: 6,
          rawX: point.x,
          rawY: point.y,
        },
      ];
    });
  }

  protected pointCx(value: number): number {
    return this.valueToCanvasX(value);
  }

  protected comparisonStrokeDasharray(series: MhdChartSeries): string | null {
    return series.comparison ? '0' : null;
  }

  protected trackSeries(_: number, series: MhdChartSeries): string {
    return series.id;
  }

  protected seriesPoints(series: MhdChartSeries): ChartPoint[] {
    return series.data.flatMap((point, index) => {
      if (typeof point.y !== 'number') {
        return [];
      }

      return [
        {
          x: this.valueToCanvasX(point.x),
          y: this.valueToCanvasY(point.y),
          rawX: point.x,
          rawY: point.y,
          index,
        },
      ];
    });
  }

  protected handlePlotHover(event: MouseEvent): void {
    const target = event.currentTarget as SVGRectElement | null;
    if (!target) {
      return;
    }

    const bounds = target.getBoundingClientRect();
    const relativeX = this.clamp(event.clientX - bounds.left, 0, bounds.width);
    const ratio = bounds.width <= 0 ? 0 : relativeX / bounds.width;

    const rawX = this.xMin() + ratio * Math.max(0, this.xMax() - this.xMin());
    const snappedX = this.findClosestXValue(rawX);

    this.hoveredXValue.set(snappedX);
  }

  protected clearHover(): void {
    this.hoveredXValue.set(null);
  }

  async exportChartAsPng(filename?: string): Promise<void> {
    const exportElement = this.exportContentRef()?.nativeElement;
    if (!exportElement) {
      return;
    }

    const svgElement = exportElement.querySelector(
      '.chart-svg'
    ) as SVGSVGElement | null;

    if (!svgElement) {
      return;
    }

    const exportWidth = Math.ceil(exportElement.offsetWidth);
    const chartPixelHeight =
      Math.ceil(svgElement.getBoundingClientRect().height) || 260;
    const legendLayout =
      this.config().showLegend === false
        ? { items: [], totalHeight: 0 }
        : this.buildLegendLayout(exportWidth);

    const exportHeight = chartPixelHeight + legendLayout.totalHeight;
    const chartSvgMarkup = this.buildExportChartSvgMarkup(
      svgElement,
      exportWidth,
      chartPixelHeight
    );
    const legendSvgMarkup = this.buildExportLegendSvgMarkup(
      legendLayout,
      chartPixelHeight
    );

    const svgMarkup = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${exportWidth}" height="${exportHeight}" viewBox="0 0 ${exportWidth} ${exportHeight}">
        <rect x="0" y="0" width="${exportWidth}" height="${exportHeight}" fill="#ffffff" />
        ${chartSvgMarkup}
        ${legendSvgMarkup}
      </svg>
    `;

    const blob = new Blob([svgMarkup], {
      type: 'image/svg+xml;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);

    try {
      const image = await this.loadImage(url);
      const canvas = this.document.createElement('canvas');
      canvas.width = exportWidth * 2;
      canvas.height = exportHeight * 2;

      const context = canvas.getContext('2d');
      if (!context) {
        return;
      }

      context.scale(2, 2);
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, exportWidth, exportHeight);
      context.drawImage(image, 0, 0, exportWidth, exportHeight);

      const dataUrl = canvas.toDataURL('image/png');
      const link = this.document.createElement('a');
      link.href = dataUrl;
      link.download = this.buildExportFilename(filename);
      link.click();
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  private buildExportChartSvgMarkup(
    svgElement: SVGSVGElement,
    width: number,
    height: number
  ): string {
    const clone = svgElement.cloneNode(true) as SVGSVGElement;

    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', `${width}`);
    clone.setAttribute('height', `${height}`);
    clone.setAttribute('x', '0');
    clone.setAttribute('y', '0');
    clone.style.display = 'block';
    clone.style.background = '#ffffff';
    clone.style.overflow = 'visible';

    clone.querySelectorAll('.chart-hover-overlay').forEach((element) => {
      element.remove();
    });

    clone.querySelectorAll('.chart-hover-line').forEach((element) => {
      element.remove();
    });

    clone.querySelectorAll('.chart-hover-point').forEach((element) => {
      element.remove();
    });

    this.applyExportSvgPresentation(clone);

    return new XMLSerializer().serializeToString(clone);
  }

  private applyExportSvgPresentation(svg: SVGSVGElement): void {
    svg
      .querySelectorAll<SVGLineElement>('.chart-grid-line')
      .forEach((element) => {
        element.setAttribute('stroke', '#e7e7e7');
        element.setAttribute('stroke-width', '1');
        element.setAttribute('shape-rendering', 'crispEdges');
      });

    svg
      .querySelectorAll<SVGLineElement>('.chart-axis-line')
      .forEach((element) => {
        element.setAttribute('stroke', '#d8dde3');
        element.setAttribute('stroke-width', '1');
        element.setAttribute('shape-rendering', 'crispEdges');
      });

    svg
      .querySelectorAll<SVGTextElement>('.chart-y-label, .chart-x-label')
      .forEach((element) => {
        element.setAttribute('fill', '#7b8591');
        element.setAttribute('font-size', '12');
        element.setAttribute(
          'font-family',
          'Inter, Arial, Helvetica, sans-serif'
        );
      });

    svg.querySelectorAll<SVGPathElement>('.chart-line').forEach((element) => {
      element.setAttribute('fill', 'none');
      element.setAttribute('stroke-width', '3');
      element.setAttribute('stroke-linecap', 'round');
      element.setAttribute('stroke-linejoin', 'round');
    });

    svg
      .querySelectorAll<SVGPathElement>('.chart-line--comparison')
      .forEach((element) => {
        element.setAttribute('stroke-width', '2.5');
        element.setAttribute('opacity', '0.9');
      });

    svg.querySelectorAll<SVGPathElement>('.chart-area').forEach((element) => {
      element.setAttribute('opacity', '0.6');
    });

    svg
      .querySelectorAll<SVGPathElement>('.chart-area--comparison')
      .forEach((element) => {
        element.setAttribute('opacity', '0.22');
      });

    svg.querySelectorAll<SVGRectElement>('.chart-bar').forEach((element) => {
      element.setAttribute('opacity', '0.92');
    });

    svg
      .querySelectorAll<SVGRectElement>('.chart-bar--comparison')
      .forEach((element) => {
        element.setAttribute('opacity', '0.35');
      });

    svg
      .querySelectorAll<SVGLineElement>('.chart-now-line')
      .forEach((element) => {
        element.setAttribute('stroke', '#0ea5e9');
        element.setAttribute('stroke-width', '2');
      });

    svg
      .querySelectorAll<SVGTextElement>('.chart-now-label')
      .forEach((element) => {
        element.setAttribute('fill', '#0ea5e9');
        element.setAttribute('font-size', '11');
        element.setAttribute('font-weight', '700');
        element.setAttribute(
          'font-family',
          'Inter, Arial, Helvetica, sans-serif'
        );
      });
  }

  private buildLegendLayout(width: number): ExportLegendLayout {
    const items: ExportLegendItem[] = this.normalizedSeries().map((series) => ({
      id: series.id,
      label: series.label,
      color: series.color,
      comparison: series.comparison,
      inactive: !this.isSeriesVisible(series.id),
    }));

    if (!items.length) {
      return {
        items: [],
        totalHeight: 0,
      };
    }

    const horizontalPadding = 16;
    const topPadding = 6;
    const bottomPadding = 16;
    const rowGap = 10;
    const itemGap = 18;
    const rowHeight = 16;
    const availableWidth = Math.max(120, width - horizontalPadding * 2);

    const rows: ExportLegendPositionedItem[][] = [];
    let currentRow: ExportLegendPositionedItem[] = [];
    let currentRowWidth = 0;

    for (const item of items) {
      const itemWidth = this.measureLegendItemWidth(item.label);
      const positionedItem: ExportLegendPositionedItem = {
        ...item,
        x: 0,
        y: 0,
        width: itemWidth,
      };

      const nextWidth =
        currentRow.length === 0
          ? itemWidth
          : currentRowWidth + itemGap + itemWidth;

      if (currentRow.length > 0 && nextWidth > availableWidth) {
        rows.push(currentRow);
        currentRow = [positionedItem];
        currentRowWidth = itemWidth;
      } else {
        currentRow.push(positionedItem);
        currentRowWidth = nextWidth;
      }
    }

    if (currentRow.length) {
      rows.push(currentRow);
    }

    const positionedItems: ExportLegendPositionedItem[] = rows.flatMap(
      (row, rowIndex) => {
        const rowWidth =
          row.reduce((sum, item) => sum + item.width, 0) +
          itemGap * Math.max(0, row.length - 1);

        let cursorX = horizontalPadding + (availableWidth - rowWidth) / 2;
        const y = topPadding + rowIndex * (rowHeight + rowGap) + rowHeight / 2;

        return row.map((item) => {
          const nextItem = {
            ...item,
            x: cursorX,
            y,
          };

          cursorX += item.width + itemGap;
          return nextItem;
        });
      }
    );

    const totalHeight =
      topPadding +
      rows.length * rowHeight +
      Math.max(0, rows.length - 1) * rowGap +
      bottomPadding;

    return {
      items: positionedItems,
      totalHeight,
    };
  }

  private buildExportLegendSvgMarkup(
    layout: ExportLegendLayout,
    offsetY: number
  ): string {
    if (!layout.items.length) {
      return '';
    }

    const parts = layout.items.map((item) => {
      const dotX = item.x;
      const dotY = offsetY + item.y;
      const textX = item.x + 20;
      const textY = offsetY + item.y + 4;
      const opacity = item.inactive ? 0.35 : 1;

      if (item.comparison) {
        return `
          <g opacity="${opacity}">
            <rect x="${dotX}" y="${
          dotY - 6
        }" width="12" height="12" rx="4" ry="4" fill="${this.escapeXmlAttribute(
          item.color
        )}" />
            <text x="${textX}" y="${textY}" fill="#2f3742" font-size="15" font-family="Inter, Arial, Helvetica, sans-serif">${this.escapeXml(
          item.label
        )}</text>
          </g>
        `;
      }

      return `
        <g opacity="${opacity}">
          <circle cx="${
            dotX + 6
          }" cy="${dotY}" r="6" fill="${this.escapeXmlAttribute(item.color)}" />
          <text x="${textX}" y="${textY}" fill="#2f3742" font-size="15" font-family="Inter, Arial, Helvetica, sans-serif">${this.escapeXml(
        item.label
      )}</text>
        </g>
      `;
    });

    return `<g>${parts.join('')}</g>`;
  }

  private measureLegendItemWidth(label: string): number {
    const dotWidth = 12;
    const gapAfterDot = 8;
    const averageCharacterWidth = 7.2;
    const endPadding = 4;

    return (
      dotWidth + gapAfterDot + label.length * averageCharacterWidth + endPadding
    );
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });
  }

  private buildExportFilename(filename?: string): string {
    const fallback = this.title();
    const base = (filename?.trim() || fallback || 'chart')
      .toLowerCase()
      .replace(/<[^>]+>/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return `${base || 'chart'}.png`;
  }

  private findClosestXValue(value: number): number | null {
    const allX = this.allXValues();
    if (!allX.length) {
      return null;
    }

    let closest = allX[0];
    let minDistance = Math.abs(allX[0] - value);

    for (let index = 1; index < allX.length; index += 1) {
      const candidate = allX[index];
      const distance = Math.abs(candidate - value);

      if (distance < minDistance) {
        closest = candidate;
        minDistance = distance;
      }
    }

    return closest;
  }

  private valueToCanvasX(value: number): number {
    const min = this.xMin();
    const max = this.xMax();

    if (max <= min) {
      return this.paddingLeft + this.plotWidth / 2;
    }

    const ratio = (value - min) / (max - min);
    return this.paddingLeft + ratio * this.plotWidth;
  }

  private valueToCanvasY(value: number): number {
    const max = this.yMax();

    if (max <= 0) {
      return this.plotBottom;
    }

    return this.plotBottom - (value / max) * this.plotHeight;
  }

  private normalizeSeriesData(data: MhdChartPoint[]): MhdChartPoint[] {
    return [...data].sort((a, b) => a.x - b.x);
  }

  private formatYAxis(value: number): string {
    return (
      this.config().yAxisFormatter?.(value) ?? this.defaultNumberFormat(value)
    );
  }

  private formatTooltipTitle(value: number): string {
    return (
      this.config().tooltipTitleFormatter?.(value) ??
      this.formatXAxisLabel(value)
    );
  }

  private formatTooltipValue(value: number): string {
    return (
      this.config().tooltipValueFormatter?.(value) ?? this.formatYAxis(value)
    );
  }

  private formatCurrentTimeLabel(value: number): string {
    return (
      this.config().currentTimeLabelFormatter?.(value) ??
      `${this.formatXAxisLabel(value)}`
    );
  }

  private defaultNumberFormat(value: number): string {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }

    if (value >= 1_000) {
      return `${Math.round(value / 1_000)}k`;
    }

    return `${Math.round(value)}`;
  }

  private toNiceMax(value: number): number {
    if (value <= 0) {
      return 10;
    }

    const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
    const normalized = value / magnitude;

    if (normalized <= 1) {
      return 1 * magnitude;
    }

    if (normalized <= 2) {
      return 2 * magnitude;
    }

    if (normalized <= 5) {
      return 5 * magnitude;
    }

    return 10 * magnitude;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  private escapeXml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private escapeXmlAttribute(value: string): string {
    return this.escapeXml(value);
  }
}
