import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MhdDropdownComponent } from '../dropdown/mhd-dropdown.component';
import { MhdIconComponent } from '../icon/mhd-icon.component';

export interface MhdInlineSelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'mhd-inline-select',
  standalone: true,
  imports: [CommonModule, MhdDropdownComponent, MhdIconComponent],
  templateUrl: './mhd-inline-select.component.html',
  styleUrl: './mhd-inline-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MhdInlineSelectComponent {
  readonly options = input<MhdInlineSelectOption[]>([]);
  readonly value = input<string>('');
  readonly minWidth = input(220);
  readonly disabled = input(false);

  readonly valueChange = output<string>();

  protected readonly open = model(false);

  protected readonly selectedLabel = computed(
    () =>
      this.options().find((option) => option.value === this.value())?.label ??
      ''
  );

  protected selectValue(value: string): void {
    this.valueChange.emit(value);
    this.open.set(false);
  }
}
