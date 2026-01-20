import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mhd-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mhd-icon.component.html',
  styleUrls: ['./mhd-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MhdIconComponent {
  readonly color = input<string>('');
  readonly size = input<string>('');

  readonly icon = input.required<string>();
  readonly iconSet = input<string>('fas');

  readonly subIcon = input<string>('');
  readonly subIconSet = input<string>('fas');

  readonly subSize = input<string>('');
  readonly subColor = input<string>('');

  @HostBinding('class')
  get hostClasses(): string {
    return ['mhd-icon', 'inline-flex', 'items-center', this.color(), this.size()]
      .filter(Boolean)
      .join(' ');
  }

  get mainIconClasses(): string {
    return [this.iconSet(), this.icon()].filter(Boolean).join(' ');
  }

  get subIconClasses(): string {
    return [this.subIconSet(), this.subIcon(), this.subSize(), this.subColor()]
      .filter(Boolean)
      .join(' ');
  }

  get hasSubIcon(): boolean {
    return !!this.subIcon();
  }
}
