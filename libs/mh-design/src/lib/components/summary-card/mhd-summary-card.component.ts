import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mhd-summary-card',
  standalone: true,
  templateUrl: './mhd-summary-card.component.html',
  styleUrl: './mhd-summary-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MhdSummaryCardComponent {}
