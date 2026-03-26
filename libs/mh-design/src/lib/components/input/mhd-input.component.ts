import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MhdIconComponent } from '../icon/mhd-icon.component';

@Component({
  selector: 'mhd-input',
  standalone: true,
  imports: [CommonModule, MhdIconComponent],
  templateUrl: './mhd-input.component.html',
  styleUrl: './mhd-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MhdInputComponent {
  readonly label = input('');
  readonly placeholder = input('');
  readonly type = input<'text' | 'email' | 'number' | 'search'>('text');
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly hint = input('');
  readonly error = input('');
  readonly inputId = input('');
  readonly leadingIcon = input('');
  readonly trailingIcon = input('');
  readonly value = model('');

  protected readonly describedBy = computed(() => {
    const ids: string[] = [];

    if (this.hint()) {
      ids.push(`${this.effectiveId()}-hint`);
    }

    if (this.error()) {
      ids.push(`${this.effectiveId()}-error`);
    }

    return ids.join(' ');
  });

  protected effectiveId(): string {
    return (
      this.inputId() ||
      `mhd-input-${this.label().toLowerCase().replace(/\s+/g, '-') || 'field'}`
    );
  }

  protected handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
  }
}
