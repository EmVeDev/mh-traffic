import { Component, HostBinding, input } from '@angular/core';

@Component({
  selector: 'mhd-logo',
  standalone: true,
  templateUrl: './mhd-logo.component.html',
  styleUrl: './mhd-logo.component.scss',
})
export class MhdLogoComponent {
  size = input.required<number>();
  animate = input<boolean>(false);

  @HostBinding('style.width.px')
  get widthPx(): number {
    return this.size();
  }

  @HostBinding('style.height.px')
  get heightPx(): number {
    return this.size();
  }

  @HostBinding('class.is-animated')
  get isAnimated(): boolean {
    return this.animate();
  }
}
