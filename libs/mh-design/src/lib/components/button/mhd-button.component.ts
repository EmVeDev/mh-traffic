import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MhdIconComponent } from '../icon/mhd-icon.component';

export type MhdButtonVariant = 'primary' | 'secondary' | 'ghost';
export type MhdButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'mhd-button',
  standalone: true,
  imports: [CommonModule, MhdIconComponent],
  templateUrl: './mhd-button.component.html',
  styleUrl: './mhd-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MhdButtonComponent {
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly variant = input<MhdButtonVariant>('secondary');
  readonly size = input<MhdButtonSize>('md');
  readonly disabled = input(false);
  readonly fullWidth = input(false);
  readonly active = input(false);
  readonly leadingIcon = input('');
  readonly trailingIcon = input('');
  readonly iconSet = input<'fas' | 'far' | 'fab'>('fas');

  @HostBinding('class')
  protected get hostClasses(): string {
    return ['mhd-button-host', this.fullWidth() ? 'mhd-button-host--full' : '']
      .filter(Boolean)
      .join(' ');
  }

  protected get buttonClasses(): string {
    return [
      'mhd-button',
      `mhd-button--${this.variant()}`,
      `mhd-button--${this.size()}`,
      this.active() ? 'mhd-button--active' : '',
      this.fullWidth() ? 'mhd-button--full' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
}
