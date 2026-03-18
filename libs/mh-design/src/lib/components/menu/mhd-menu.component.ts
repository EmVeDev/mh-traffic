import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
export type MenuPosition = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

@Component({
  selector: 'mhd-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
    <div
      class="menu-container shadow-lg border bg-white"
      [ngClass]="positionClass()"
      (click)="$event.stopPropagation()"
    >
      <ng-content></ng-content>
    </div>
    <!-- Backdrop to close when clicking outside -->
    <div class="menu-backdrop" (click)="closeMenu()"></div>
    }
  `,
  styles: [
    `
      .menu-container {
        position: absolute;
        z-index: 1000;
        min-width: 200px;
        margin: 4px;
      }

      .menu-backdrop {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100vw;
        height: 100vh;
        z-index: 999;
        background: transparent;
      }
    `,
  ],
})
export class MhdMenuComponent {
  isOpen = signal(false);
  position = input<MenuPosition>('top-end');
  positionClass = computed(() => `pos-${this.position()}`);
  backdropClick = output<void>();
  toggle() {
    this.isOpen.update((v) => !v);
  }

  closeMenu() {
    this.isOpen.set(false);
    this.backdropClick.emit();
  }
}
