import {Component, inject, signal} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {NavItem, UiShellStore} from './state/ui-shell.store';
import {MhDesignModule} from "@mh-traffic/mh-design";
import {filter} from "rxjs";
import {MhdLogoComponent} from "../../../../libs/mh-design/src/lib/mhd-logo/mhd-logo.component";

@Component({
  selector: 'td-root',
  standalone: true,
  imports: [RouterOutlet, MhDesignModule, MhdLogoComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {

  public readonly uiStore = inject(UiShellStore);
  private readonly router = inject(Router);
  private readonly url = signal(this.router.url);

  constructor() {
    // Force “desktop layout” in extension mode even when the iframe is narrow.
    if ((globalThis as any).__TD_EXTENSION__ === true) {
      document.documentElement.classList.add('td-extension');
    }

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.url.set(e.urlAfterRedirects));
  }

  onSubmenuClick(route: string) {
    this.router.navigateByUrl(route);
    this.uiStore.openContent();
  }

  isOnChildRoute(item: NavItem): boolean {
    const url = this.url();
    return item.children?.some(child => url.includes(child.route)) ?? false;
  }
  private normalizeUrl(url: string): string {
    // drop query + fragment, normalize trailing slash (except root)
    const base = url.split('#')[0]!.split('?')[0]!;
    if (base.length > 1 && base.endsWith('/')) return base.slice(0, -1);
    return base;
  }


  private isUrlMatch(currentUrl: string, targetRoute: string): boolean {
    const cur = this.normalizeUrl(currentUrl);
    const target = this.normalizeUrl(targetRoute);

    if (target === '/') return cur === '/';
    return cur === target || cur.startsWith(`${target}/`);
  }


  isOnItemRoute(item: NavItem): boolean {
    const currentUrl = this.url();

    // parent route match (if it exists)
    if (item.route && this.isUrlMatch(currentUrl, item.route)) return true;

    // any child match
    return (item.children ?? []).some((c) => this.isUrlMatch(currentUrl, c.route));
  }

  public categoryClick(item: NavItem) {
    if (item.route) {
      this.router.navigateByUrl(item.route);
    } else {
      this.uiStore.activeNavId() === item.id ? this.uiStore.collapse() : this.uiStore.openSubmenu(item.id);
    }
  }
}
