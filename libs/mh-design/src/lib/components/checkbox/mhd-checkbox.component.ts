import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MhdIconComponent } from '../icon/mhd-icon.component';

@Component({
  selector: 'mhd-checkbox',
  standalone: true,
  imports: [CommonModule, MhdIconComponent],
  templateUrl: './mhd-checkbox.component.html',
  styleUrl: './mhd-checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MhdCheckboxComponent {
  readonly label = input('');
  readonly description = input('');
  readonly disabled = input(false);
  readonly checked = model(false);

  protected toggle(): void {
    if (this.disabled()) {
      return;
    }

    this.checked.update((value) => !value);
  }
}
