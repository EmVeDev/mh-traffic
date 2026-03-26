import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MhdIconComponent } from '../icon/mhd-icon.component';

@Component({
  selector: 'mhd-select-trigger',
  standalone: true,
  imports: [CommonModule, MhdIconComponent],
  templateUrl: './mhd-select-trigger.component.html',
  styleUrl: './mhd-select-trigger.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MhdSelectTriggerComponent {
  readonly label = input('');
  readonly placeholder = input('');
  readonly open = input(false);
  readonly active = input(false);
  readonly compact = input(false);
  readonly disabled = input(false);
  readonly tone = input<'default' | 'accent'>('default');
  readonly chevron = input(true);

  @HostBinding('class')
  protected get hostClasses(): string {
    return [
      'mhd-select-trigger-host',
      this.disabled() ? 'mhd-select-trigger-host--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  protected get triggerClasses(): string {
    return [
      'mhd-select-trigger',
      this.compact() ? 'mhd-select-trigger--compact' : '',
      this.active() ? 'mhd-select-trigger--active' : '',
      this.open() ? 'mhd-select-trigger--open' : '',
      this.tone() === 'accent' ? 'mhd-select-trigger--accent' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  protected get displayText(): string {
    return this.label() || this.placeholder();
  }

  protected get isPlaceholder(): boolean {
    return !this.label();
  }
}
