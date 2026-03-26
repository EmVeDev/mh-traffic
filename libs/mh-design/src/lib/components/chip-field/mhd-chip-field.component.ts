import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MhdIconComponent } from '../icon/mhd-icon.component';

export interface MhdChipFieldItem {
  value: string;
  label: string;
}

@Component({
  selector: 'mhd-chip-field',
  standalone: true,
  imports: [CommonModule, MhdIconComponent],
  templateUrl: './mhd-chip-field.component.html',
  styleUrl: './mhd-chip-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MhdChipFieldComponent {
  readonly label = input('');
  readonly placeholder = input('');
  readonly disabled = input(false);
  readonly chips = input<MhdChipFieldItem[]>([]);

  readonly chipRemove = output<string>();
  readonly fieldClick = output<void>();

  protected removeChip(value: string, event: Event): void {
    event.stopPropagation();

    if (this.disabled()) {
      return;
    }

    this.chipRemove.emit(value);
  }

  protected handleFieldClick(): void {
    if (this.disabled()) {
      return;
    }

    this.fieldClick.emit();
  }
}
