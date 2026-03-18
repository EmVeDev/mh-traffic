import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'mhd-metric-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricCardComponent {
  public title = input<string>('');
  public linkLabel = input<string>('');
  public outlined = input(false);
  public headerClass = input<string>('');
}
