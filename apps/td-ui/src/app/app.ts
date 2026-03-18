import { Component, HostListener, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UiShellStore } from './state/ui-shell.store';
import {
  MhdMenuComponent,
  MhdIconComponent,
  MhdLogoComponent,
} from '@mh-traffic/mh-design';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'td-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MhdIconComponent,
    MhdLogoComponent,
    MhdMenuComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent implements OnInit {
  private readonly translate = inject(TranslocoService);
  public readonly uiStore = inject(UiShellStore);

  @HostListener('document:keydown.escape')
  onEsc(): void {
    // Close mobile drawer with Escape (web only)
    if (!this.uiStore.isExtension() && this.uiStore.mobileOpen()) {
      this.uiStore.closeMobile();
    }
  }

  ngOnInit() {
    const userLang = localStorage.getItem('mh-traffic_user_language') || 'en';
    this.translate.setDefaultLang('en');
    this.translate.setActiveLang(userLang);
    console.log('User language:', userLang);
  }
}
