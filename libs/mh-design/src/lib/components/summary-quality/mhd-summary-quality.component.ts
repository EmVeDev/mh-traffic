import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MhdIconComponent } from '../icon/mhd-icon.component';

export interface MhdSummaryQualityItem {
  label: string;
  value: string;
  fillPercent: number;
  tone: 'red' | 'yellow' | 'green';
}

@Component({
  selector: 'mhd-summary-quality',
  standalone: true,
  imports: [MhdIconComponent],
  templateUrl: './mhd-summary-quality.component.html',
  styleUrl: './mhd-summary-quality.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MhdSummaryQualityComponent {
  readonly label = input('READING QUALITY');
  readonly items = input<MhdSummaryQualityItem[]>([]);

  protected fillClass(tone: MhdSummaryQualityItem['tone']): string {
    switch (tone) {
      case 'red':
        return 'mhd-summary-quality__fill mhd-summary-quality__fill--red';
      case 'yellow':
        return 'mhd-summary-quality__fill mhd-summary-quality__fill--yellow';
      case 'green':
        return 'mhd-summary-quality__fill mhd-summary-quality__fill--green';
    }
  }
}
