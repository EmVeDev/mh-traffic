import { Component, input } from '@angular/core';

@Component({
  selector: 'mhd-pill-select',
  standalone: true,
  templateUrl: './mhd-pill-select.component.html',
  styleUrl: './mhd-pill-select.component.scss',
})
export class MhdPillSelectComponent {
  public options = input<string[]>([]);
}
