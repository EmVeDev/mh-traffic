import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MhdDropdownComponent } from '../dropdown/mhd-dropdown.component';
import { MhdInputComponent } from '../input/mhd-input.component';
import { MhdSelectTriggerComponent } from '../select-trigger/mhd-select-trigger.component';

export interface MhdSelectOption {
  value: string;
  label: string;
  description?: string;
  leadingLabel?: string;
  leadingClass?: string;
}

@Component({
  selector: 'mhd-select',
  standalone: true,
  imports: [
    CommonModule,
    MhdDropdownComponent,
    MhdInputComponent,
    MhdSelectTriggerComponent,
  ],
  templateUrl: './mhd-select.component.html',
  styleUrl: './mhd-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MhdSelectComponent {
  readonly label = input('');
  readonly placeholder = input('Select');
  readonly disabled = input(false);
  readonly compact = input(false);
  readonly tone = input<'default' | 'accent'>('default');
  readonly minPanelWidth = input(260);
  readonly searchable = input(false);
  readonly searchPlaceholder = input('Search');
  readonly options = input.required<MhdSelectOption[]>();

  readonly value = model<string>('');

  protected readonly open = signal(false);
  protected readonly searchValue = signal('');

  protected readonly selectedOption = computed(() =>
    this.options().find((option) => option.value === this.value())
  );

  protected readonly filteredOptions = computed(() => {
    const query = this.searchValue().trim().toLowerCase();

    if (!query) {
      return this.options();
    }

    return this.options().filter((option) => {
      const haystack = `${option.label} ${
        option.description ?? ''
      }`.toLowerCase();
      return haystack.includes(query);
    });
  });

  protected toggleOpen(): void {
    if (this.disabled()) {
      return;
    }

    this.open.update((current) => !current);

    if (!this.open()) {
      this.searchValue.set('');
    }
  }

  protected selectValue(value: string): void {
    this.value.set(value);
    this.open.set(false);
    this.searchValue.set('');
  }

  protected isSelected(value: string): boolean {
    return this.value() === value;
  }

  protected handleSearchChange(value: string): void {
    this.searchValue.set(value);
  }
}
