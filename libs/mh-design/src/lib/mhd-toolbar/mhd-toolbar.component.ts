import { Component, input } from '@angular/core';

@Component({
  selector: 'mhd-toolbar',
  standalone: true,
  templateUrl: './mhd-toolbar.component.html',
  styleUrl: './mhd-toolbar.component.scss',
})
export class MhdToolbarComponent {
  public title = input<string | null>(null);
}
