import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MhdButtonComponent } from '../button/mhd-button.component';

@Component({
  selector: 'mhd-filter-actions',
  standalone: true,
  imports: [MhdButtonComponent],
  templateUrl: './mhd-filter-actions.component.html',
  styleUrl: './mhd-filter-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MhdFilterActionsComponent {
  readonly clear = output<void>();
  readonly apply = output<void>();

  protected onClear(): void {
    this.clear.emit();
  }

  protected onApply(): void {
    this.apply.emit();
  }
}
