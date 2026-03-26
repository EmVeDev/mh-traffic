import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MhdButtonComponent } from '../button/mhd-button.component';
import {
  MhdChipFieldComponent,
  MhdChipFieldItem,
} from '../chip-field/mhd-chip-field.component';
import { MhdDropdownComponent } from '../dropdown/mhd-dropdown.component';
import { MhdIconComponent } from '../icon/mhd-icon.component';
import { MhdInputComponent } from '../input/mhd-input.component';

export interface MhdMultiSelectOption {
  value: string;
  label: string;
  description?: string;
}

@Component({
  selector: 'mhd-multi-select',
  standalone: true,
  imports: [
    CommonModule,
    MhdButtonComponent,
    MhdChipFieldComponent,
    MhdDropdownComponent,
    MhdIconComponent,
    MhdInputComponent,
  ],
  templateUrl: './mhd-multi-select.component.html',
  styleUrl: './mhd-multi-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.mhd-multi-select-host--full-width]': 'fullWidth()',
  },
})
export class MhdMultiSelectComponent {
  readonly label = input('');
  readonly placeholder = input('Select options');
  readonly panelTitle = input('Select options');
  readonly disabled = input(false);
  readonly searchable = input(true);
  readonly searchPlaceholder = input('Search');
  readonly minPanelWidth = input(360);
  readonly options = input.required<MhdMultiSelectOption[]>();
  readonly fullWidth = input(false);

  readonly selectedValues = model<string[]>([]);

  protected readonly open = signal(false);
  protected readonly searchValue = signal('');

  protected readonly selectedChips = computed<MhdChipFieldItem[]>(() => {
    const selected = new Set(this.selectedValues());

    return this.options()
      .filter((option) => selected.has(option.value))
      .map((option) => ({
        value: option.value,
        label: option.label,
      }));
  });

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

    this.open.update((value) => !value);
  }

  protected close(): void {
    this.open.set(false);
  }

  protected isSelected(value: string): boolean {
    return this.selectedValues().includes(value);
  }

  protected toggleValue(value: string): void {
    const selected = this.selectedValues();

    if (selected.includes(value)) {
      this.selectedValues.set(selected.filter((item) => item !== value));
      return;
    }

    this.selectedValues.set([...selected, value]);
  }

  protected removeValue(value: string): void {
    this.selectedValues.set(
      this.selectedValues().filter((item) => item !== value)
    );
  }

  protected clearAll(): void {
    this.selectedValues.set([]);
  }

  protected handleSearchChange(value: string): void {
    this.searchValue.set(value);
  }
}
