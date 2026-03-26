import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';

export type MhdDropdownPosition = 'bottom-start' | 'bottom-end';

@Component({
  selector: 'mhd-dropdown',
  standalone: true,
  imports: [CommonModule, OverlayModule],
  templateUrl: './mhd-dropdown.component.html',
  styleUrl: './mhd-dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MhdDropdownComponent {
  readonly open = model(false);
  readonly position = input<MhdDropdownPosition>('bottom-start');
  readonly minWidth = input<number | null>(null);
  readonly offsetY = input(8);
  readonly closeOnBackdrop = input(true);

  readonly opened = output<void>();
  readonly closed = output<void>();

  protected get positions(): ConnectedPosition[] {
    if (this.position() === 'bottom-end') {
      return [
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
          offsetY: this.offsetY(),
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom',
          offsetY: -this.offsetY(),
        },
      ];
    }

    return [
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        offsetY: this.offsetY(),
      },
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetY: -this.offsetY(),
      },
    ];
  }

  protected handleOpen(): void {
    this.opened.emit();
  }

  protected handleDetach(): void {
    this.closed.emit();
  }

  protected handleBackdropClick(): void {
    if (!this.closeOnBackdrop()) {
      return;
    }

    this.open.set(false);
    this.closed.emit();
  }
}
