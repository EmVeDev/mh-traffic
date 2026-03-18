import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

export interface JourneySegment {
  label: string;
  width: number;
  className: string;
}

@Component({
  selector: 'mhd-journey-bar',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './journey-bar.component.html',
  styleUrl: './journey-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JourneyBarComponent {
  public segments = input<JourneySegment[]>([]);
}
