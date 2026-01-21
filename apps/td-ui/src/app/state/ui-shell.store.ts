import {
  Injectable,
  computed,
  effect,
  inject,
  signal,
  untracked
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

/**
 * Determines if the app is running as a Chrome Extension.
 * Checked via a global flag or the protocol.
 */
function isExtensionMode(): boolean {
  return (
    (globalThis as any).__TD_EXTENSION__ === true ||
    globalThis.location?.protocol === 'chrome-extension:'
  );
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/**
 * Strips query parameters and hashes from a URL to ensure stable route matching.
 * Prevents logic from breaking when URLs include tracking params or anchors.
 */
function normalizePath(url: string): string {
  const q = url.indexOf('?');
  const h = url.indexOf('#');
  const cut =
    q === -1 && h === -1
      ? -1
      : Math.min(q === -1 ? Infinity : q, h === -1 ? Infinity : h);

  return cut === -1 ? url : url.slice(0, cut);
}



/**
 * Global state management for the UI Shell (Sidebar, Navigation, and Layout).
 * Handles responsiveness, hover/click interactions for the navigation accordion,
 * and specific communication logic for when the app is embedded in a browser extension.
 */
@Injectable({ providedIn: 'root' })
export class UiShellStore {
  /** Indicates if the application is running in Extension mode */
  readonly isExtension = signal<boolean>(isExtensionMode());
  /** The primary navigation structure including direct routes and nested categories */
  readonly navItems = signal<NavItem[]>([
    { id: 'home', label: 'Dashboard', icon: 'fa-home', route: '/' },
    {
      id: 'content',
      label: 'Content',
      icon: 'fa-newspaper',
      children: [
        { id: 'tags', label: 'Tags', route: '/content/tags' },
        {
          id: 'sections',
          label: 'Sections',
          route: '/content/sections'
        }
      ]
    },
    {
      id: 'referrers',
      label: 'Referrers',
      icon: 'fa-hexagon-nodes',
      route: '/referrers'
    },
    {
      id: 'audiences',
      label: 'Audiences',
      icon: 'fa-users',
      route: '/audiences'
    },
    {
      id: 'performance-kpis',
      label: 'Performance KPIs',
      icon: 'fa-arrow-trend-up',
      route: '/performance-kpis'
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: 'fa-cog',
      route: '/admin'
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: 'fa-screwdriver-wrench',
      children: [
        { id: 'suggestions', label: 'Suggestions', route: '/suggestions' },
        { id: 'ab-testing', label: 'A/B Testing', route: '/ab-testing' }
      ]
    }
  ]);
  /** Hover/expand behavior (web + extension) */
  readonly hoveredItemId = signal<string | null>(null);
  readonly pinnedCategoryId = signal<string | null>(null); // accordion open while expanded
  readonly sidebarHover = signal<boolean>(false);
  /** Mobile drawer (web only) */
  readonly mobileOpen = signal<boolean>(false);
  /**
   * Computed: Identifies which category (if any) should currently be open.
   * If the sidebar is collapsed, no category can be open.
   * Pinned (clicked) categories take precedence over hovered categories.
   */
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
  /** Semantic layout mode for CSS class binding */
  readonly uiMode = computed<UiMode>(() => {
    if (!this.sidebarExpanded()) return 'collapsed';
    return 'submenu';
  });
  /**
   * Computed: The width in pixels the sidebar occupies.
   * Essential for the extension to tell the parent window how much space to reserve.
   */
  readonly sidebarWidthPx = computed<number>(() => {
    // collapsed icon bar vs expanded accordion
    return this.sidebarExpanded() ? 280 : 56;
  });
  private readonly router = inject(Router);
  /** Current normalized URL signal updated on every navigation event */
  readonly url = signal<string>(normalizePath(this.router.url));
  /**
   * Extension: show actual content for all routes EXCEPT "/_blank".
   * Web: always show.
   */
  readonly showPage = computed<boolean>(() => {
    if (!this.isExtension()) return true;
    return this.url() !== '/_blank';
  });
  /** Responsive breakpoint (ignored in extension mode) */
  private readonly mobileBpPx = 860;
  private readonly viewportW = signal<number>(
    typeof window !== 'undefined' ? window.innerWidth : 9999
  );
  /** Responsive check: Mobile behavior is disabled in Extension mode */
  readonly isMobile = computed<boolean>(() => {
    if (this.isExtension()) return false;
    return this.viewportW() <= this.mobileBpPx;
  });
  /**
   * Computed: Determines if the sidebar should show labels and expanded accordions.
   * On Mobile: Depends on the drawer toggle.
   * On Desktop: Depends on whether the user is hovering the sidebar area.
   */
  readonly sidebarExpanded = computed<boolean>(() => {
    if (this.isMobile()) return this.mobileOpen();

    // Desktop: expand while hovering anywhere in sidebar
    return this.sidebarHover();
  });

  constructor() {
    // Sync Router events to our internal URL signal and handle post-navigation side effects
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        const next = normalizePath(e.urlAfterRedirects || e.url);
        this.url.set(next);

        // Close mobile drawer after navigation (web only)
        if (!this.isExtension()) this.mobileOpen.set(false);

        // Extension: Inform the host iframe to go 'full-width' or 'sidebar-only'
        if (this.isExtension()) {
          const msg: DrawerMsg =
            next === '/_blank'
              ? { type: 'TD_UI_DRAWER', widthPx: this.sidebarWidthPx() }
              : { type: 'TD_UI_DRAWER', fullWidth: true };

          try {
            globalThis.parent?.postMessage(msg, '*');
          } catch {
            // ignore
          }
        }
      });

    // Extension Effect: Whenever the sidebar expands/collapses while hidden,
    // update the parent iframe so it can resize the drawer container.
    effect(() => {
      if (!this.isExtension()) return;

      // Only send width updates while hidden (blank page)
      if (this.url() !== '/_blank') return;

      const widthPx = this.sidebarWidthPx();
      const msg: DrawerMsg = { type: 'TD_UI_DRAWER', widthPx };

      try {
        globalThis.parent?.postMessage(msg, '*');
      } catch {
        // ignore
      }
    });

    // Cleanup Effect: Reset interaction states when the sidebar is no longer expanded
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

  /** Ensures the parent category remains 'hovered' while the mouse is over its children */
  onChildEnter(parent: NavItem): void {
    this.hoveredItemId.set(parent.id);
  }

  /**
   * Toggles the 'pinned' state of a category.
   * If a category is pinned, it stays open even if the mouse leaves the item.
   */
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
    return this.url() === normalizePath(route);
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
    // - direct route item => navigate (with extension toggle logic)
    // - category => pin/unpin accordion (only meaningful when expanded)
    if (item.route) {
      void this.navigateNav(item.route);
    }
    if (item.children?.length) {
      this.togglePinCategory(item);
      return;
    }
  }

  onChildClick(child: NavChild): void {
    void this.navigateNav(child.route);
  }

  logout() {
    console.log('Logging out'); // TODO: logout
  }

  /**
   * Internal navigation wrapper.
   * In Extension Mode: Acts as a toggle. Clicking the active route
   * navigates to "/_blank", effectively 'closing' the app drawer.
   */
  private async navigateNav(targetRoute: string): Promise<void> {
    const targetPath = normalizePath(targetRoute);
    const currentPath = this.url();

    // Only toggle-hide in extension mode.
    if (!this.isExtension()) {
      await this.router.navigateByUrl(targetRoute);
      return;
    }

    // If user clicks the route they are already on (and it's not "/"), hide via "/_blank".
    if (currentPath === targetPath) {
      await this.router.navigateByUrl('/_blank');
      return;
    }

    // Otherwise navigate normally to show content.
    await this.router.navigateByUrl(targetRoute);
  }
}
