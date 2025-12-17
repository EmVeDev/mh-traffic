import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
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
  @Input() color: string = '';
  @Input() size: string = '';

  @Input({ required: true }) icon!: string;
  @Input() iconSet: string = 'fas';

  @Input() subIcon: string = '';
  @Input() subIconSet: string = 'fas';

  @Input() subSize: string = '';
  @Input() subColor: string = '';

  @HostBinding('class')
  get hostClasses(): string {
    return ['mhd-icon', 'inline-flex', 'items-center', this.color, this.size]
      .filter(Boolean)
      .join(' ');
  }

  get mainIconClasses(): string {
    return [this.iconSet, this.icon].filter(Boolean).join(' ');
  }

  get subIconClasses(): string {
    return [this.subIconSet, this.subIcon, this.subSize, this.subColor]
      .filter(Boolean)
      .join(' ');
  }

  get hasSubIcon(): boolean {
    return !!this.subIcon;
  }
}
