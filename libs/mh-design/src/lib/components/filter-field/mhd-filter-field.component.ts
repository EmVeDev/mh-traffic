import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
} from '@angular/core';

@Component({
  selector: 'mhd-filter-field',
  standalone: true,
  templateUrl: './mhd-filter-field.component.html',
  styleUrl: './mhd-filter-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MhdFilterFieldComponent {
  readonly span = input<1 | 2 | 3 | 4>(1);
  readonly align = input<'start' | 'center' | 'end'>('end');

  @HostBinding('class')
  protected get hostClasses(): string {
    return [
      'mhd-filter-field-host',
      `mhd-filter-field-host--span-${this.span()}`,
      `mhd-filter-field-host--align-${this.align()}`,
    ].join(' ');
  }
}
