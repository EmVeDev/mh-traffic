import { Component, HostListener, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UiShellStore } from './state/ui-shell.store';
import { MhdIconComponent } from '../../../../libs/mh-design/src/lib/mhd-icon/mhd-icon.component';

@Component({
  selector: 'td-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MhdIconComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  readonly uiStore = inject(UiShellStore);

  @HostListener('document:keydown.escape')
  onEsc(): void {
    // Close mobile drawer with Escape (web only)
    if (!this.uiStore.isExtension() && this.uiStore.mobileOpen()) {
      this.uiStore.closeMobile();
    }
  }
}
