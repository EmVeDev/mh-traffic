import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MhdIconComponent } from '../icon/mhd-icon.component';

export type MhdSummaryMetricDeltaTone = 'positive' | 'negative' | 'neutral';
export type MhdSummaryMetricValueType = 'text' | 'number';

@Component({
  selector: 'mhd-summary-metric',
  standalone: true,
  imports: [MhdIconComponent],
  templateUrl: './mhd-summary-metric.component.html',
  styleUrl: './mhd-summary-metric.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MhdSummaryMetricComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly valueType = input<MhdSummaryMetricValueType>('text');
  readonly valueSuffix = input('');
  readonly delta = input('');
  readonly deltaTone = input<MhdSummaryMetricDeltaTone>('neutral');
  readonly info = input(true);
  readonly locale = input('nl-BE');

  protected readonly deltaClass = computed(() => {
    switch (this.deltaTone()) {
      case 'positive':
        return 'mhd-summary-metric__delta mhd-summary-metric__delta--positive';
      case 'negative':
        return 'mhd-summary-metric__delta mhd-summary-metric__delta--negative';
      default:
        return 'mhd-summary-metric__delta';
    }
  });

  protected readonly displayValue = computed(() => {
    const value = this.value();

    if (typeof value === 'number' && this.valueType() === 'number') {
      return `${new Intl.NumberFormat(this.locale()).format(
        value
      )}${this.valueSuffix()}`;
    }

    return `${value}${this.valueSuffix()}`;
  });
}
