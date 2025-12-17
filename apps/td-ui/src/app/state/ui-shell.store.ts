import {Injectable, computed, signal, effect} from '@angular/core';

export type NavItem = {
  id: string;
  label: string;
  icon: string;
  route?: string;
  children?: Array<{ id: string; label: string; route: string }>;
};

type DrawerMsg =
  | { type: 'TD_UI_DRAWER'; widthPx: number; fullWidth?: false }
  | { type: 'TD_UI_DRAWER'; fullWidth: true };

type UiMode = 'collapsed' | 'submenu' | 'content';

@Injectable({providedIn: 'root'})
export class UiShellStore {
  readonly mode = signal<UiMode>('collapsed');
  readonly activeNavId = signal<string | null>(null);

  // Configure widths in one place
  readonly drawerClosedWidthPx = 60;
  readonly drawerPeekWidthPx = 260;

  readonly navItems = signal<NavItem[]>([
    {id: 'home', label: 'Dashboard', icon: 'fa-home', route: '/'},
    {
      id: 'content',
      label: 'Content',
      icon: 'fa-newspaper',
      children: [
        {id: 'tool-a', label: 'Tool A', route: '/tool-a'},
      ],
    },
    {
      id: 'referrers',
      label: 'Referrers',
      icon: 'fa-hexagon-nodes',
      route: '/referrers',
    },
    {
      id: 'audiences',
      label: 'Audiences',
      icon: 'fa-users',
      route: '/audiences',
    },
    {
      id: 'performance-kpis',
      label: 'Performance KPIs',
      icon: 'fa-arrow-trend-up',
      route: '/performance-kpis',
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: 'fa-cog',
      route: '/admin',
    },
  ]);

  readonly activeNavItem = computed(() => {
    const id = this.activeNavId();
    return this.navItems().find((x) => x.id === id) ?? null;
  });

  readonly showSubmenu = computed(() => this.mode() === 'submenu');
  readonly showContentChrome = computed(() => this.mode() === 'content');
  private readonly _emitDrawerStateToHost = effect(() => {
    const mode = this.mode();

    const msg: DrawerMsg =
      mode === 'content'
        ? {type: 'TD_UI_DRAWER', fullWidth: true}
        : {
          type: 'TD_UI_DRAWER',
          widthPx: mode === 'submenu' ? this.drawerPeekWidthPx : this.drawerClosedWidthPx,
          fullWidth: false,
        };

    window.parent.postMessage(msg, '*');
  });

  collapse() {
    this.mode.set('collapsed');
    this.activeNavId.set(null);
  }

  openSubmenu(navId: string) {
    this.activeNavId.set(navId);
    this.mode.set('submenu');
  }

  openContent() {
    this.mode.set('content');
  }
}
