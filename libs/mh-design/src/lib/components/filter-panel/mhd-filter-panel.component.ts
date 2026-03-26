import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'mhd-filter-panel',
  standalone: true,
  templateUrl: './mhd-filter-panel.component.html',
  styleUrl: './mhd-filter-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MhdFilterPanelComponent {
  readonly title = input('Filters');
}
