import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MhdIconComponent } from '../icon/mhd-icon.component';

@Component({
  selector: 'mhd-summary-section',
  standalone: true,
  imports: [MhdIconComponent],
  templateUrl: './mhd-summary-section.component.html',
  styleUrl: './mhd-summary-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MhdSummarySectionComponent {
  readonly title = input.required<string>();
  readonly icon = input.required<string>();
}
