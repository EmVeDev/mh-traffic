import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface SimpleListRow {
  value: string;
  label: string;
}

@Component({
  selector: 'mhd-simple-list-card',
  standalone: true,
  templateUrl: './simple-list-card.component.html',
  styleUrl: './simple-list-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleListCardComponent {
  public title = input.required<string>();
  public linkLabel = input<string>('');
  public rows = input<SimpleListRow[]>([]);
}
