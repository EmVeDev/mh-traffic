import {
  Injectable,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export type NavChild = { id: string; label: string; route: string };

export type NavItem = {
  id: string;
  label: string;
  icon: string; // e.g. 'fa-home'
  route?: string; // direct route items
  children?: NavChild[]; // category items
};

export type UiMode = 'collapsed' | 'submenu' | 'content';

type DrawerMsg =
  | { type: 'TD_UI_DRAWER'; widthPx: number; fullWidth?: false }
  | { type: 'TD_UI_DRAWER'; fullWidth: true };

function isExtensionMode(): boolean {
  return (
    (globalThis as any).__TD_EXTENSION__ === true ||
    globalThis.location?.protocol === 'chrome-extension:'
  );
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

@Injectable({ providedIn: 'root' })
export class UiShellStore {
  private readonly router = inject(Router);

  /** Mode */
  readonly isExtension = signal<boolean>(isExtensionMode());

  /** Nav */
  readonly navItems = signal<NavItem[]>([
    { id: 'home', label: 'Dashboard', icon: 'fa-home', route: '/' },
    {
      id: 'content',
      label: 'Content',
      icon: 'fa-newspaper',
      children: [{ id: 'tool-a', label: 'Tool A', route: '/tool-a' }],
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

  /** Router url (exact match rules handled in helpers below) */
  readonly url = signal<string>(this.router.url);

  /** Hover/expand behavior (web + extension) */
  readonly hoveredItemId = signal<string | null>(null);
  readonly pinnedCategoryId = signal<string | null>(null); // accordion open while expanded
  readonly sidebarHover = signal<boolean>(false);

  /** Mobile drawer (web only) */
  readonly mobileOpen = signal<boolean>(false);

  /** Responsive breakpoint (ignored in extension mode) */
  private readonly mobileBpPx = 860;
  private readonly viewportW = signal<number>(
    typeof window !== 'undefined' ? window.innerWidth : 9999
  );

  readonly isMobile = computed<boolean>(() => {
    if (this.isExtension()) return false;
    return this.viewportW() <= this.mobileBpPx;
  });

  /** Sidebar expanded means labels + accordion are visible */
  readonly sidebarExpanded = computed<boolean>(() => {
    if (this.isMobile()) return this.mobileOpen();

    // Desktop: expand while hovering anywhere in sidebar
    return this.sidebarHover();
  });

  /** Which category is currently open in the accordion */
  readonly openCategoryId = computed<string | null>(() => {
    if (!this.sidebarExpanded()) return null;

    // If user clicked to pin a category open, respect it.
    const pinned = this.pinnedCategoryId();
    if (pinned) return pinned;

    // Otherwise: open the hovered category (if it has children) OR
    // if hovering a child, keep parent open (handled by setting hoveredItemId to parent on child enter)
    const hovered = this.hoveredItemId();
    if (!hovered) return null;

    const item = this.navItems().find((x) => x.id === hovered);
    if (item?.children?.length) return item.id;

    return null;
  });

  /** Hide page in extension until on a non-root route (so iframe can be expanded by parent) */
  readonly showPage = computed<boolean>(() => {
    if (!this.isExtension()) return true;

    // "only when they navigate to a page" — treat '/' as the shell-only route.
    return this.url() !== '/';
  });

  /** Layout mode (used for CSS hooks) */
  readonly uiMode = computed<UiMode>(() => {
    if (!this.sidebarExpanded()) return 'collapsed';
    return 'submenu';
  });

  /** Sidebar width for extension messaging (optional) */
  readonly sidebarWidthPx = computed<number>(() => {
    // collapsed icon bar vs expanded accordion
    return this.sidebarExpanded() ? 280 : 56;
  });

  constructor() {
    // Track router URL
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.url.set(e.urlAfterRedirects || e.url);
        // Close mobile drawer after navigation (web only)
        if (!this.isExtension()) this.mobileOpen.set(false);

        // In extension mode, inform parent iframe about desired width/full-width
        if (this.isExtension()) {
          const msg: DrawerMsg =
            (e.urlAfterRedirects || e.url) === '/'
              ? { type: 'TD_UI_DRAWER', widthPx: this.sidebarWidthPx() }
              : { type: 'TD_UI_DRAWER', fullWidth: true };

          try {
            globalThis.parent?.postMessage(msg, '*');
          } catch {
            // ignore
          }
        }
      });

    // Keep parent iframe informed about sidebar width changes while in extension
    effect(() => {
      if (!this.isExtension()) return;

      // Only send width updates while on shell route (page hidden)
      if (this.url() !== '/') return;

      const widthPx = this.sidebarWidthPx();
      const msg: DrawerMsg = { type: 'TD_UI_DRAWER', widthPx };

      try {
        globalThis.parent?.postMessage(msg, '*');
      } catch {
        // ignore
      }
    });

    // Safety: when leaving expanded state, clear hover and unpinned accordion
    effect(() => {
      const expanded = this.sidebarExpanded();
      if (!expanded) {
        untracked(() => {
          this.hoveredItemId.set(null);
          this.pinnedCategoryId.set(null);
        });
      }
    });
  }

  /** Called by component HostListener */
  setViewportWidth(px: number): void {
    this.viewportW.set(clamp(px, 0, 100_000));
  }

  /** Sidebar hover hooks (desktop + extension) */
  onSidebarEnter(): void {
    this.sidebarHover.set(true);
  }

  onSidebarLeave(): void {
    this.sidebarHover.set(false);
    this.hoveredItemId.set(null);
  }

  /** Item hover hooks */
  onItemEnter(item: NavItem): void {
    this.hoveredItemId.set(item.id);
  }

  onItemLeave(item: NavItem): void {
    if (this.hoveredItemId() === item.id) {
      this.hoveredItemId.set(null);
    }
  }

  /** Keep parent category open while hovering children */
  onChildEnter(parent: NavItem): void {
    this.hoveredItemId.set(parent.id);
  }

  /** Accordion: click category to pin open while expanded */
  togglePinCategory(item: NavItem): void {
    if (!item.children?.length) return;

    const current = this.pinnedCategoryId();
    this.pinnedCategoryId.set(current === item.id ? null : item.id);
  }

  /** Mobile drawer controls (web only) */
  openMobile(): void {
    if (this.isExtension()) return;
    this.mobileOpen.set(true);
  }

  closeMobile(): void {
    if (this.isExtension()) return;
    this.mobileOpen.set(false);
  }

  toggleMobile(): void {
    if (this.isExtension()) return;
    this.mobileOpen.set(!this.mobileOpen());
  }

  /** Route helpers (exact match) */
  isExactActive(route: string): boolean {
    return this.url() === route;
  }

  isChildActive(item: NavItem): boolean {
    if (!item.children?.length) return false;
    return item.children.some((c) => this.isExactActive(c.route));
  }

  /** Styling helper for icon/text-primary rule */
  isItemActive(item: NavItem): boolean {
    if (item.children?.length) return this.isChildActive(item);
    if (item.route) return this.isExactActive(item.route);
    return false;
  }

  /** Click handlers */
  onItemClick(item: NavItem): void {
    // In collapsed desktop mode, we don't auto-navigate categories; we expand on hover.
    // But click behavior:
    // - direct route item => navigate
    // - category => pin/unpin accordion (only meaningful when expanded)
    if (item.route) {
      void this.router.navigateByUrl(item.route);
    }
    if (item.children?.length) {
      this.togglePinCategory(item);
      return;
    }
  }

  onChildClick(child: NavChild): void {
    void this.router.navigateByUrl(child.route);
  }
}
